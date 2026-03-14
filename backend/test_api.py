import requests
import json

API_URL = "http://localhost:8000"

print("--- TESTING API ENDPOINTS ---")

# Step 1: Check if server is up
try:
    requests.get(API_URL)
    print("Server is UP")
except:
    print("Server is DOWN")

# Mocking data to see serializer behavior (without token, should get 401)
# If it gets 400, then it's a validation error.
headers = {"Content-Type": "application/json"}

# For validation testing, we need to bypass token or just see if it crashes.
# I will check UserProfileUpdateView again.
