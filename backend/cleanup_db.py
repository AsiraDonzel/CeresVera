import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crophealth.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile, Scan, Transaction, Conversation, Message, Consultant

def cleanup():
    print("--- CeresVera Database Cleanup ---")
    
    # 1. Delete Scans
    scan_count = Scan.objects.all().count()
    Scan.objects.all().delete()
    print(f"✓ Deleted {scan_count} scans.")
    
    # 2. Delete Transactions
    txn_count = Transaction.objects.all().count()
    Transaction.objects.all().delete()
    print(f"✓ Deleted {txn_count} transactions.")
    
    # 3. Delete Conversations & Messages
    msg_count = Message.objects.all().count()
    Message.objects.all().delete()
    conv_count = Conversation.objects.all().count()
    Conversation.objects.all().delete()
    print(f"✓ Deleted {conv_count} conversations and {msg_count} messages.")
    
    # 4. Delete Consultants
    cons_count = Consultant.objects.all().count()
    Consultant.objects.all().delete()
    print(f"✓ Deleted {cons_count} consultants.")
    
    # 5. Delete non-superuser Accounts
    users_to_delete = User.objects.filter(is_superuser=False)
    user_count = users_to_delete.count()
    
    # This will also delete related UserProfiles due to models.CASCADE
    users_to_delete.delete()
    print(f"✓ Deleted {user_count} test user accounts and their profiles.")
    
    print("----------------------------------")
    print("Cleanup successful. Superuser (Admin) accounts have been preserved for your presentation.")

if __name__ == "__main__":
    cleanup()
