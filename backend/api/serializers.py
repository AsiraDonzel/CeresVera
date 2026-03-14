from rest_framework import serializers
from .models import Consultant, Scan, Transaction, UserProfile
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
            'expertise_tags', 'verification_status'
        )

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
        data['name'] = user.first_name or user.username
        data['email'] = user.email
        
        # Safely get profile info
        try:
            profile = user.profile
            data['role'] = profile.role
            data['is_premium'] = profile.is_premium
            data['phone_number'] = profile.phone_number
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

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password', 'name', 'role', 'phone')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        # Ensure email is unique
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def validate_password(self, value):
        # We trust the frontend SHA-256 hash here.
        # No regex required for simple hex string.
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        name = validated_data.pop('name', '')
        role = validated_data.pop('role', 'farmer')
        phone = validated_data.pop('phone', '')
        
        user = User.objects.create_user(
            username=validated_data.get('username') or validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=name
        )
        
        # Try to update the auto-created profile with the selected role
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.role = role
        profile.phone_number = phone
        profile.save()
        
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
