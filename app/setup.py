"""Setup module for initializing API configurations"""
import os
from dotenv import load_dotenv
import openai
from pathlib import Path

def setup_api_keys():
    """Load API keys from environment variables and configure clients"""
    # Try multiple possible locations for .env file
    possible_paths = [
        Path(__file__).parent / '.env',  # app/.env
        Path(__file__).parent.parent / '.env',  # root/.env
        Path.cwd() / '.env'  # current directory/.env
    ]
    
    env_loaded = False
    for env_path in possible_paths:
        print(f"Trying to load .env from: {env_path.absolute()}")
        if env_path.exists():
            print(f"Found .env file at: {env_path.absolute()}")
            load_dotenv(env_path)
            env_loaded = True
            break
    
    if not env_loaded:
        print("Warning: No .env file found, will try to use environment variables directly")
    
    # Get and verify OpenAI API key
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable is missing or empty")
    
    # Set the OpenAI API key in the openai library directly
    # This helps ensure the pydantic-ai library can find it
    openai.api_key = openai_api_key
    
    # Also set it in os.environ explicitly to be sure
    os.environ["OPENAI_API_KEY"] = openai_api_key
    
    
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