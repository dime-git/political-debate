import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")  # Using the anon key from your .env file
supabase: Client = create_client(supabase_url, supabase_key)

async def store_debate(query, right_response, left_response):
    """Store a debate in the Supabase database"""
    data = {
        "query": query,
        "right_wing_response": right_response,
        "left_wing_response": left_response
    }
    response = supabase.table("debates").insert(data).execute()
    return response.data

async def get_recent_debates(limit=10):
    """Get the most recent debates"""
    response = supabase.table("debates").select("*").order("created_at", desc=True).limit(limit).execute()
    return response.data

async def get_debate_by_id(debate_id):
    """Get a specific debate by ID"""
    response = supabase.table("debates").select("*").eq("id", debate_id).execute()
    return response.data[0] if response.data else None 