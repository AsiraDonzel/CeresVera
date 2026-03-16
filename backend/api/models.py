from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('agronomist', 'Agronomist'),
    )
    CATEGORY_CHOICES = (
        ('Agronomy', 'Agronomy'),
        ('Livestock', 'Livestock'),
        ('Soil Health', 'Soil Health'),
        ('Pest Control', 'Pest Control'),
        ('General', 'General'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='farmer')
    profile_picture = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    ai_queries_count = models.IntegerField(default=0)
    last_ai_query_date = models.DateField(default=timezone.now)
    
    # Farmer Profile Data
    farm_location = models.CharField(max_length=255, blank=True, null=True)
    primary_crop = models.CharField(max_length=100, blank=True, null=True)
    farm_size = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    # Expert Profile Data
    bio = models.TextField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    certificates = models.JSONField(default=list, blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    
    # Farmer Profile Data (Extended)
    farm_name = models.CharField(max_length=255, blank=True, null=True)
    address_line = models.TextField(blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    # Stewardship Fields (New)
    crop_cycle_plans = models.TextField(blank=True, null=True)
    farm_coordinates_lat = models.FloatField(blank=True, null=True)
    farm_coordinates_lon = models.FloatField(blank=True, null=True)
    stewardship_score = models.IntegerField(default=0)
    soil_type = models.CharField(max_length=100, blank=True, null=True)
    
    # Expert Portfolio Fields (New)
    consultation_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    expertise_tags = models.JSONField(default=list, blank=True, null=True)
    expertise_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='General')
    rating = models.FloatField(default=0.0)
    
    VERIFICATION_CHOICES = (
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_CHOICES, default='PENDING')
    documents_url = models.FileField(upload_to='verification_docs/', blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    
    # Subscription Data
    SUBSCRIPTION_CHOICES = (
        ('none', 'None'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    )
    subscription_type = models.CharField(max_length=10, choices=SUBSCRIPTION_CHOICES, default='none')
    subscription_expiry = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

class Consultant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='consultant_profile', null=True, blank=True)
    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    profile_image_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    expertise_category = models.CharField(max_length=50, default='General', null=True, blank=True)
    rating = models.FloatField(default=0.0, null=True, blank=True)
    is_verified = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.specialty}"

class Scan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='scans/')
    # Analyzed outcomes
    disease_name = models.CharField(max_length=255, blank=True, null=True)
    confidence = models.FloatField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    recommended_action = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Scan {self.id} - {self.disease_name or 'Pending'}"

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('HELD_IN_ESCROW', 'Held in Escrow'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    is_escrow_released = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Txn {self.reference} - {self.status}"

class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation {self.id}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} at {self.created_at}"
