from rest_framework import serializers
from .models import Consultant, Scan, Transaction, UserProfile, Notification, Conversation, Message
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'role', 'profile_picture', 'is_premium', 'ai_queries_count', 
            'farm_location', 'primary_crop', 'farm_size', 'phone_number',
            'bio', 'linkedin_url', 'certificates', 'experience_years',
            'farm_name', 'address_line', 'state', 'country',
            'subscription_type', 'subscription_expiry',
            'crop_cycle_plans', 'farm_coordinates_lat', 'farm_coordinates_lon',
            'stewardship_score', 'soil_type', 'consultation_rate',
            'expertise_tags', 'expertise_category', 'rating', 'verification_status', 
            'documents_url', 'rejection_reason'
        )

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile', 'first_name')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom claims to the payload
        user = self.user
        data['id'] = user.id
        data['name'] = f"{user.first_name} {user.last_name}".strip() or user.username
        data['email'] = user.email
        
        # Safely get profile info
        try:
            profile = user.profile
            data['role'] = profile.role
            data['is_premium'] = profile.is_premium
            data['phone_number'] = profile.phone_number
            data['verification_status'] = profile.verification_status
            data['profile_pic'] = profile.profile_picture.url if profile.profile_picture else None
        except UserProfile.DoesNotExist:
            data['role'] = 'farmer' # Default fallback
            data['is_premium'] = False
            data['phone_number'] = None
            data['profile_pic'] = None
            
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    role = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    expertise_category = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password', 'name', 'role', 'phone', 'expertise_category')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        # Ensure email is unique
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        name = validated_data.pop('name', '').strip()
        role = validated_data.pop('role', 'farmer')
        phone = validated_data.pop('phone', '')
        expertise_category = validated_data.pop('expertise_category', 'General')
        
        name_parts = name.split(' ', 1)
        first_name = name_parts[0] if len(name_parts) > 0 else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=validated_data.get('username') or validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        
        # Try to update the auto-created profile with the selected role
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.role = role
        profile.phone_number = phone
        profile.expertise_category = expertise_category
        profile.save()

        if role == 'agronomist':
            full_name = name or (f"{first_name} {last_name}".strip()) or user.username
            print(f"DEBUG: Creating Consultant for Expert {full_name} (User ID: {user.id})")
            Consultant.objects.create(
                user=user,
                name=full_name,
                expertise_category=expertise_category,
                is_active=True,
                is_verified=True,  # Auto-verified for the hackathon
                rate=0,            # Required field (non-null in DB)
                specialty="General Agronomy",
                bio=""
            )
            print(f"DEBUG: Consultant created successfully.")
        
        return user

class ConsultantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultant
        fields = '__all__'

class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = '__all__'
        read_only_fields = ('disease_name', 'confidence', 'description', 'recommended_action', 'created_at')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('reference', 'status', 'created_at')

class ExpertReviewSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['APPROVED', 'REJECTED'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.first_name')
    
    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'sender_name', 'content', 'is_read', 'created_at')

class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ('id', 'participants', 'messages', 'created_at', 'last_message_at')
