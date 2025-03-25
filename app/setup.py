"""Setup module for initializing API configurations"""
import os
from dotenv import load_dotenv
import openai

def setup_api_keys():
    """Load API keys from environment variables and configure clients"""
    # Load environment variables from .env file
    load_dotenv()
    
    # Get and verify OpenAI API key
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable is missing or empty")
    
    # Set the OpenAI API key in the openai library directly
    # This helps ensure the pydantic-ai library can find it
    openai.api_key = openai_api_key
    
    # Also set it in os.environ explicitly to be sure
    os.environ["OPENAI_API_KEY"] = openai_api_key
    
    print(f"✅ OpenAI API key configured successfully (length: {len(openai_api_key)})")
    
    # Configure Supabase (no client needed here, just verifying)
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase configuration is incomplete. Check SUPABASE_URL and SUPABASE_SERVICE_KEY.")
    
    print("✅ Supabase configuration verified")
    
    return {
        "openai_key_length": len(openai_api_key),
        "supabase_configured": bool(supabase_url and supabase_key)
    } 