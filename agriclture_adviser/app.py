import os
from groq import Groq
import streamlit as st
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

# Initialize the Groq client
client = Groq(api_key=api_key)

# Define the agricultural topics for the chatbot
agriculture_topics = [
    "sustainable farming", "crop rotation", "soil health", "organic farming", 
    "precision agriculture", "pest management", "agricultural technology", 
    "irrigation methods", "greenhouses", "climate change and agriculture", 
    "agricultural policies", "water conservation in farming", "agriculture for beginners",
    "plant diseases and treatment", "farm management", "livestock farming", 
    "agriculture and food security", "composting", "permaculture", "hydroponics",
    "aquaponics", "agriculture markets", "food supply chain", "agroforestry", 
    "urban farming", "farming innovations", "farmer cooperatives"
]

# Function to fetch chatbot completion from Groq API
def get_response(query):
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": query}],
        temperature=0.7,
        max_completion_tokens=1024,
        top_p=1,
    )
    response = completion.choices[0].message.content
    return response

def main():
    st.title("Agriculture Issues Chatbot")

    # Let the user choose an agriculture-related topic or type a custom query
    topic = st.selectbox("Choose an agriculture-related topic", agriculture_topics)
    user_input = st.text_area("Or ask an agriculture-related question:", "")

    # If the user provides a query, we use that
    query = user_input if user_input else f"Tell me about {topic} in agriculture"

    # Create a submit button
    submit_button = st.button("Submit")

    # Call the Groq API to get the response if the button is clicked
    if submit_button and query:
        response = get_response(query)
        
        # Display the response
        st.write("### Response:")
        st.write(response)

    # Handle unrelated queries
    if user_input and not any(topic in user_input.lower() for topic in agriculture_topics):
        st.write("Sorry, I can only answer agriculture-related questions.")

if __name__ == "__main__":
    main()
