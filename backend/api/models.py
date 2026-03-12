from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('agronomist', 'Agronomist'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='farmer')
    profile_picture = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # Farmer Profile Data
    farm_location = models.CharField(max_length=255, blank=True, null=True)
    primary_crop = models.CharField(max_length=100, blank=True, null=True)
    farm_size = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Consultant(models.Model):
    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    bio = models.TextField()
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    profile_pic_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

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
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    consultant = models.ForeignKey(Consultant, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    is_escrow_released = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Txn {self.reference} - {self.status}"
