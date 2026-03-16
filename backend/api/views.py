from django.shortcuts import render
from rest_framework import viewsets, status, generics, permissions, parsers
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Consultant, Scan, Transaction, UserProfile, Notification, Conversation, Message
from .serializers import (
    ConsultantSerializer, ScanSerializer, TransactionSerializer, 
    RegisterSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer,
    ExpertReviewSerializer, NotificationSerializer, MessageSerializer, ConversationSerializer
)
import pusher
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models import Count
from django.utils import timezone
import json
import os
from groq import Groq
from openai import OpenAI
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ConsultantViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # Strictly filter by APPROVED status in UserProfile
        return Consultant.objects.filter(
            is_active=True,
            is_verified=True,
            user__profile__verification_status='APPROVED'
        ).order_by('-is_premium', 'id')
    serializer_class = ConsultantSerializer

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_visibility(self, request):
        try:
            consultant = Consultant.objects.get(user=request.user)
            consultant.is_active = not consultant.is_active
            consultant.save()
            return Response({'is_active': consultant.is_active}, status=status.HTTP_200_OK)
        except Consultant.DoesNotExist:
            return Response({'error': 'Consultant profile not found'}, status=status.HTTP_404_NOT_FOUND)

class MarketplaceExpertListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ConsultantSerializer

    def get_queryset(self):
        # Fail-proof: return all experts for hackathon
        return Consultant.objects.all().order_by('-is_premium', '-id')

class ScanUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ScanSerializer(data=request.data)
        if serializer.is_valid():
            # Associate the scan with the logged-in user if available
            user = request.user if request.user.is_authenticated else None
            scan = serializer.save(user=user)
            
            # Run local Hugging Face model inference
            try:
                from .model import get_classifier, get_leaf_validator
                from .disease_data import get_disease_info

                img_path = scan.image.path

                # Validate leaf
                leaf_validator = get_leaf_validator()
                is_leaf, leaf_conf = leaf_validator.is_leaf(img_path)

                if not is_leaf:
                    scan.disease_name = "Not a Plant Leaf"
                    scan.confidence = float(leaf_conf * 100)
                    scan.description = "The uploaded image does not appear to be a plant leaf."
                    scan.recommended_action = "Please upload a clear image of a plant leaf for accurate detection."
                else:
                    classifier = get_classifier()
                    preds = classifier.predict(img_path, top_k=1)
                    
                    if preds:
                        top = preds[0]
                        class_name = top['class']
                        info = get_disease_info(class_name) or {}
                        
                        scan.disease_name = info.get('name', class_name)
                        scan.confidence = float(top['confidence'])
                        scan.description = info.get('symptoms', 'Details not available.')
                        
                        org = info.get('treatment_organic', 'None')
                        chem = info.get('treatment_chemical', 'None')
                        scan.recommended_action = f"Organic: {org} | Chemical: {chem}"
                    else:
                        raise ValueError("No prediction results from the local AI model.")
                
            except Exception as e:
                print(f"Local AI Error: {e}")
                scan.disease_name = "Analysis Failed"
                scan.confidence = 0.0
                scan.description = f"The AI encountered an error: {str(e)}"
                scan.recommended_action = "Consult an expert directly."
                
            scan.save()
            return Response(ScanSerializer(scan).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ScanListView(generics.ListAPIView):
    serializer_class = ScanSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Scan.objects.filter(user=self.request.user).order_by('-created_at')

class PaymentInitiateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        consultant_id = request.data.get('consultant_id')
        # Trust frontend amount if provided, fallback to consultant rate
        amount = request.data.get('amount')
        
        if consultant_id:
            try:
                consultant = Consultant.objects.get(id=consultant_id)
                # Ensure we don't send 0 to Interswitch
                consultant_rate = max(consultant.rate or 0, 15000)
                final_amount = amount if amount else consultant_rate
            except Consultant.DoesNotExist:
                return Response({'error': 'Consultant not found'}, status=status.HTTP_404_NOT_FOUND)
        elif amount:
            final_amount = amount
            consultant = None # Platform payment
        else:
            return Response({'error': 'Missing consultant_id or amount'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Generate a globally unique reference using timestamp + random
        import time, random
        txn_ref = f"MX-TRN-{int(time.time())}{random.randint(10, 99)}"

        transaction = Transaction.objects.create(
            user=request.user,
            consultant=consultant,
            amount=final_amount,
            reference=txn_ref,
            status='PENDING'
        )
        
        # Amount in kobo (minor denomination) as string - matches sample
        amount_kobo = str(int(float(final_amount) * 100))
        
        # Exact payload structure from Interswitch sample
        payload = {
            'merchant_code': settings.INTERSWITCH_MERCHANT_CODE,
            'pay_item_id': settings.INTERSWITCH_PAY_ITEM_ID,
            'txn_ref': txn_ref,
            'amount': amount_kobo,
            'currency': 566, # Naira
            'mode': 'TEST',
            'site_redirect_url': request.data.get('site_redirect_url', '')
        }

        print(f"[ISW] Payment payload: {payload}")
        return Response(payload, status=status.HTTP_200_OK)

class PaymentCallbackView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        txn_ref = request.data.get('txn_ref')
        response_code = request.data.get('response_code') # Interswitch '00' is success
        
        try:
            transaction = Transaction.objects.get(reference=txn_ref)
            
            # Mock success check - in production we'd verify hash or query Interswitch status
            if response_code == '00' or request.data.get('status') == 'SUCCESS':
                transaction.status = 'HELD_IN_ESCROW'
                transaction.save()
                
                # Auto-upgrade to premium if applicable
                user_profile = transaction.user.profile
                if float(transaction.amount) in [2500, 25000, 4500, 45000]:
                    user_profile.is_premium = True
                    user_profile.save()

                # If consultation payment, create conversation and notify expert
                if transaction.consultant and transaction.consultant.user:
                    farmer = transaction.user
                    expert = transaction.consultant.user
                    
                    # Check if conversation exists (Farmer + Expert)
                    conversations = Conversation.objects.annotate(pcnt=Count('participants')).filter(pcnt=2)
                    conversations = conversations.filter(participants=farmer).filter(participants=expert)
                    
                    if not conversations.exists():
                        conversation = Conversation.objects.create()
                        conversation.participants.set([farmer, expert])
                        print(f"[DEBUG] Created new conversation {conversation.id} for payment {txn_ref}")
                    
                    # Notify the Consultant
                    Notification.objects.create(
                        user=expert,
                        title="New Booking Request",
                        message=f"Farmer {farmer.first_name or farmer.username} has paid for a consultation. A new chat has been opened for you."
                    )
                    print(f"[DEBUG] Notified Expert {expert.username} for payment {txn_ref}")

                return Response({'status': 'Payment successful, funds held in escrow'}, status=status.HTTP_200_OK)
            else:
                transaction.status = 'FAILED'
                transaction.save()
                return Response({'status': 'Payment failed'}, status=status.HTTP_400_BAD_REQUEST)
                
        except Transaction.DoesNotExist:
            return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)

class PaymentReleaseEscrowView(APIView):
    def post(self, request, *args, **kwargs):
        txn_ref = request.data.get('txn_ref')
        try:
            transaction = Transaction.objects.get(reference=txn_ref, status='SUCCESS')
            if transaction.is_escrow_released:
                return Response({'status': 'Escrow already released'}, status=status.HTTP_200_OK)
            transaction.is_escrow_released = True
            transaction.save()
            return Response({'status': 'Funds released to consultant'}, status=status.HTTP_200_OK)
        except Transaction.DoesNotExist:
            return Response({'error': 'Transaction not found or not successful yet.'}, status=status.HTTP_404_NOT_FOUND)

class HotspotListView(APIView):
    def get(self, request, *args, **kwargs):
        # We fetch scans that have coords and compile them to hotspots
        scans = Scan.objects.exclude(latitude__isnull=True).exclude(longitude__isnull=True)
        # In a real app we might group them, but we can return all points for mapping
        data = [{
            'id': s.id,
            'disease_name': s.disease_name,
            'confidence': s.confidence,
            'latitude': s.latitude,
            'longitude': s.longitude,
            'created_at': s.created_at
        } for s in scans]
        return Response(data, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class GoogleAuthView(APIView):
    """
    Supports both:
    - access_token flow: from useGoogleLogin() on the frontend (token_type='access_token')
    - id_token flow: from Google One Tap (no token_type)
    Verifies the token, then creates/retrieves a Django user and returns a JWT pair.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        import requests as http_requests

        credential = request.data.get('credential')
        token_type = request.data.get('token_type', '')

        if not credential:
            return Response({'error': 'Google credential token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if token_type == 'access_token':
                # Fetch user info using Google's userinfo endpoint
                userinfo_response = http_requests.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    headers={'Authorization': f'Bearer {credential}'}
                )
                if userinfo_response.status_code != 200:
                    return Response({'error': 'Failed to verify Google access token.'}, status=status.HTTP_401_UNAUTHORIZED)
                id_info = userinfo_response.json()
            else:
                # Verify Google ID token
                GOOGLE_CLIENT_ID = os.environ.get(
                    'GOOGLE_CLIENT_ID',
                    '605914999241-ca9qb0iib923ma24ptkpc2j4rjhdk7le.apps.googleusercontent.com'
                )
                id_info = id_token.verify_oauth2_token(
                    credential,
                    google_requests.Request(),
                    GOOGLE_CLIENT_ID,
                    clock_skew_in_seconds=10
                )

            google_email = id_info.get('email')
            google_name = id_info.get('name', '')

            if not google_email:
                return Response({'error': 'Could not retrieve email from Google.'}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create Django user by email
            user, created = User.objects.get_or_create(
                email=google_email,
                defaults={
                    'username': google_email,
                    'first_name': google_name.split(' ')[0] if google_name else '',
                    'last_name': ' '.join(google_name.split(' ')[1:]) if google_name else '',
                }
            )

            # Issue JWT pair
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'email': google_email,
                'name': google_name,
                'created': created,
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({'error': f'Invalid Google token: {str(e)}'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class AvatarUploadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def post(self, request, *args, **kwargs):
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if 'profile_picture' not in request.FILES:
            return Response({'error': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)

        user_profile.profile_picture = request.FILES['profile_picture']
        user_profile.save()

        # Build full URL if needed or just return the path
        if user_profile.profile_picture:
            photo_url = request.build_absolute_uri(user_profile.profile_picture.url)
            return Response({'profile_picture': photo_url}, status=status.HTTP_200_OK)
            
        return Response({'error': 'Failed to save image.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AgricultureAdviserView(APIView):
    """
    Handles queries to the Groq llama-3.3-70b-versatile model for agricultural advice.
    Replaces the Streamlit implementation with a native REST API.
    """
    permission_classes = (permissions.IsAuthenticated,)

    AGRICULTURE_TOPICS = [
        "sustainable farming", "crop rotation", "soil health", "organic farming", 
        "precision agriculture", "pest management", "agricultural technology", 
        "irrigation methods", "greenhouses", "climate change and agriculture", 
        "agricultural policies", "water conservation in farming", "agriculture for beginners",
        "plant diseases and treatment", "farm management", "livestock farming", 
        "agriculture and food security", "composting", "permaculture", "hydroponics",
        "aquaponics", "agriculture markets", "food supply chain", "agroforestry", 
        "urban farming", "farming innovations", "farmer cooperatives"
    ]

    def post(self, request, *args, **kwargs):
        # AI Rate Limiting Check
        user_profile, _ = UserProfile.objects.get_or_create(user=request.user)
        today = timezone.now().date()
        
        if user_profile.last_ai_query_date != today:
            user_profile.ai_queries_count = 0
            user_profile.last_ai_query_date = today
            user_profile.save()
            
        if not user_profile.is_premium and user_profile.ai_queries_count >= 5:
            return Response(
                {'error': 'Daily limit reached', 'requires_upgrade': True}, 
                status=status.HTTP_403_FORBIDDEN
            )

        query = request.data.get('query', '')
        topic = request.data.get('topic', '')

        # Enforce agriculture context
        if query and not any(t in query.lower() for t in self.AGRICULTURE_TOPICS) and not topic:
            return Response({
                'response': "Sorry, I can only answer agriculture-related questions. Please choose a topic or ask about farming."
            }, status=status.HTTP_200_OK)

        final_query = query if query else f"Tell me about {topic} in agriculture"

        try:
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key or api_key == "your_groq_api_key_here":
                return Response({'error': 'Cera AI is offline (API key missing or placeholder detected). Update backend/.env.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": final_query}],
                temperature=0.7,
                max_completion_tokens=1024,
                top_p=1,
            )
            
            # Increment usage on success
            user_profile.ai_queries_count += 1
            user_profile.save()
            
            response_content = completion.choices[0].message.content
            return Response({'response': response_content}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeepseekAdviserView(APIView):
    """
    Handles queries to the Deepseek AI model (deepseek-chat) acting as the main CeraAI Assistant.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        # AI Rate Limiting Check
        user_profile, _ = UserProfile.objects.get_or_create(user=request.user)
        today = timezone.now().date()
        
        if user_profile.last_ai_query_date != today:
            user_profile.ai_queries_count = 0
            user_profile.last_ai_query_date = today
            user_profile.save()
            
        if not user_profile.is_premium and user_profile.ai_queries_count >= 5:
            return Response(
                {'error': 'Daily limit reached', 'requires_upgrade': True}, 
                status=status.HTTP_403_FORBIDDEN
            )

        query = request.data.get('query', '')
        
        if not query:
            return Response({'error': 'No query provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                return Response({'error': 'Cera AI is currently offline (API key missing). Please contact support.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            client = Groq(api_key=api_key)

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are CeraAI, a highly intelligent and helpful agricultural and general-purpose farming assistant. Provide clear, concise, and expert responses. Format with standard markdown."},
                    {"role": "user", "content": query}
                ],
                temperature=0.7,
                max_completion_tokens=1024,
                top_p=1,
            )
            
            # Increment usage on success
            user_profile.ai_queries_count += 1
            user_profile.save()
            
            response_content = completion.choices[0].message.content
            return Response({'response': response_content}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileUpdateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        with open('error_log.txt', 'a') as f:
            f.write(f"\n--- Request to {request.path} ---\n")
            f.write(f"User: {request.user}\n")
            f.write(f"Data: {json.dumps(request.data, indent=2)}\n")
        
        try:
            user_profile, created = UserProfile.objects.get_or_create(user=request.user)
            serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
            if (serializer.is_valid()):
                serializer.save()
                
                # If status updated to APPROVED, synchronize with Consultant model
                if request.data.get('verification_status') == 'APPROVED':
                    Consultant.objects.get_or_create(
                        user=request.user,
                        defaults={
                            'name': f"{request.user.first_name} {request.user.last_name}".strip(),
                            'specialty': user_profile.expertise_category or 'General',
                            'bio': user_profile.bio or '',
                            'rate': max(user_profile.consultation_rate or 0, 15000),
                            'expertise_category': user_profile.expertise_category or 'General',
                            'profile_image_url': user_profile.profile_picture.url if user_profile.profile_picture else '',
                            'is_verified': True,
                            'is_active': True
                        }
                    )
                    # Update existing if already exists
                    Consultant.objects.filter(user=request.user).update(
                        is_verified=True,
                        expertise_category=user_profile.expertise_category or 'General',
                        name=f"{request.user.first_name} {request.user.last_name}".strip(),
                        bio=user_profile.bio or '',
                        rate=max(user_profile.consultation_rate or 0, 15000),
                        profile_image_url=user_profile.profile_picture.url if user_profile.profile_picture else '',
                        is_active=True
                    )
                
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            with open('error_log.txt', 'a') as f:
                f.write(f"Errors: {json.dumps(serializer.errors, indent=2)}\n")
            return Response({'error': 'Validation failed', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            with open('error_log.txt', 'a') as f:
                f.write(f"Exception: {str(e)}\n")
            return Response({'error': 'Server error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            # In a real app, send this via email. Mocking for now.
            reset_code = get_random_string(length=4, allowed_chars='0123456789')
            request.session['reset_code'] = reset_code
            request.session['reset_email'] = email
            print(f"DEBUG: Password reset code for {email} is {reset_code}")
            return Response({'message': 'Code sent successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetVerifyView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        code = request.data.get('code')
        stored_code = request.session.get('reset_code')
        if code == stored_code:
            return Response({'message': 'Code verified'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.session.get('reset_email')
        new_password = request.data.get('password')
        if not email or not new_password:
            return Response({'error': 'Session expired or missing data'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            # Clear session
            del request.session['reset_code']
            del request.session['reset_email']
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class NotificationListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_at('-created_at')

class AdminExpertPendingView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        pending_experts = UserProfile.objects.filter(role='agronomist', verification_status='PENDING')
        serializer = UserProfileSerializer(pending_experts, many=True)
        # We need to include email/name from User too
        data = []
        for profile in pending_experts:
            p_data = UserProfileSerializer(profile).data
            p_data['email'] = profile.user.email
            p_data['full_name'] = f"{profile.user.first_name} {profile.user.last_name}"
            data.append(p_data)
        return Response(data)

class AdminExpertReviewView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, profile_id):
        try:
            profile = UserProfile.objects.get(id=profile_id)
            serializer = ExpertReviewSerializer(data=request.data)
            if serializer.is_valid():
                status = serializer.validated_data['status']
                reason = serializer.validated_data.get('rejection_reason', '')
                
                profile.verification_status = status
                if status == 'REJECTED':
                    profile.rejection_reason = reason
                elif status == 'APPROVED':
                    # Create or update marketplace Consultant entry
                    Consultant.objects.get_or_create(
                        user=profile.user,
                        defaults={
                            'name': f"{profile.user.first_name} {profile.user.last_name}",
                            'specialty': 'General Agronomy', # Default specialty
                            'bio': profile.bio or '',
                            'rate': profile.consultation_rate or 0,
                            'expertise_category': profile.expertise_category or 'General',
                            'profile_image_url': profile.profile_picture.url if profile.profile_picture else '',
                            'is_verified': True,
                            'is_active': True
                        }
                    )
                    # For existing consultants, update their verified status
                    Consultant.objects.filter(user=profile.user).update(
                        is_verified=True,
                        expertise_category=profile.expertise_category or 'General',
                        name=f"{profile.user.first_name} {profile.user.last_name}",
                        bio=profile.bio or '',
                        rate=profile.consultation_rate or 0,
                        profile_image_url=profile.profile_picture.url if profile.profile_picture else ''
                    )

                profile.save()

                # Notify user
                title = "Account Verified" if status == 'APPROVED' else "Account Review Result"
                message = "Your expert profile has been approved! You are now live on the marketplace." if status == 'APPROVED' else f"Your expert profile was not approved. Reason: {reason}"
                
                Notification.objects.create(
                    user=profile.user,
                    title=title,
                    message=message
                )

                # TODO: send_mail(title, message, settings.DEFAULT_FROM_EMAIL, [profile.user.email])

                return Response({'status': f'Expert {status.lower()} successfully'})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).order_by('-last_message_at')

    def create(self, request, *args, **kwargs):
        participant_ids = request.data.get('participants', [])
        if not participant_ids:
            return Response({'error': 'Participants required'}, status=status.HTTP_400_BAD_REQUEST)
        
        participant_ids = [int(pid) for pid in participant_ids]
        if request.user.id not in participant_ids:
            participant_ids.append(request.user.id)
        
        conversations = Conversation.objects.annotate(pcnt=Count('participants')).filter(pcnt=len(participant_ids))
        for p_id in participant_ids:
            conversations = conversations.filter(participants__id=p_id)
        
        if conversations.exists():
            return Response(ConversationSerializer(conversations.first()).data)
            
        conversation = Conversation.objects.create()
        conversation.participants.set(participant_ids)
        return Response(ConversationSerializer(conversation).data, status=status.HTTP_201_CREATED)

class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        message.conversation.last_message_at = timezone.now()
        message.conversation.save()
        
        try:
            pusher_client = pusher.Pusher(
                app_id=os.environ.get('PUSHER_APP_ID', '12345'),
                key=os.environ.get('PUSHER_KEY', 'local_key'),
                secret=os.environ.get('PUSHER_SECRET', 'local_secret'),
                cluster=os.environ.get('PUSHER_CLUSTER', 'mt1'),
                ssl=True
            )
            pusher_client.trigger(
                f'conversation_{message.conversation.id}', 
                'new-message', 
                MessageSerializer(message).data
            )
        except Exception as e:
            print(f"Pusher Error: {e}")
@api_view(['POST'])
@permission_classes([AllowAny])
def expert_registration_view(request):
    """
    FAIL-PROOF REGISTRATION: Bypasses strict form validation and forces database entry.
    """
    try:
        # Extract data explicitly from POST for maximum reliability
        name = request.data.get('name', 'Anonymous Expert')
        specialty = request.data.get('specialty', 'General Agronomy')
        bio = request.data.get('bio', 'Expert ready to assist.')
        rate = request.data.get('rate', 0)
        profile_image_url = request.data.get('profile_image_url', '')

        # Force save logic using objects.create()
        expert = Consultant.objects.create(
            name=name,
            specialty=specialty,
            bio=bio,
            rate=rate,
            profile_image_url=profile_image_url,
            is_active=True,  # Always active
            is_verified=True # Auto-verified for instant visibility
        )
        
        print(f"SUCCESS: Expert {name} saved to database with ID {expert.id}")
        return Response({
            "status": "success",
            "message": f"Expert {name} registered and verified successfully!",
            "expert_id": expert.id
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Detailed error printing for terminal debugging
        print(f"HACKATHON ALERT: Registration failed! Error: {str(e)}")
        return Response({
            "status": "error",
            "message": "Critical registration error occurred.",
            "debug_info": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

def marketplace_view(request):
    """
    HTML VIEW: Fetches all experts and renders them using the marketplace template.
    """
    experts = Consultant.objects.all().order_by('-is_premium', '-id')
    return render(request, 'marketplace_template.html', {'experts': experts})
