import os
from dotenv import load_dotenv
import requests
import json
from typing import Dict, List, Any, Optional

# Load environment variables
load_dotenv()

# Get Supabase connection details
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase environment variables")

class SimpleSupabaseClient:
    def __init__(self, url: str, key: str):
        self.url = url
        self.key = key
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    
    def table(self, table_name: str):
        return TableQuery(self, table_name)

class TableQuery:
    def __init__(self, client: SimpleSupabaseClient, table_name: str):
        self.client = client
        self.table_name = table_name
        self.query_params = {}
        self.order_params = None
        self.limit_val = None
        self.eq_filters = {}
    
    def select(self, columns: str = "*"):
        self.query_params["select"] = columns
        return self
    
    def insert(self, data: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.client.url}/rest/v1/{self.table_name}"
        response = requests.post(url, headers=self.client.headers, json=data)
        response.raise_for_status()
        return response.json()
    
    def limit(self, count: int):
        self.limit_val = count
        return self
    
    def order(self, column: str, desc: bool = False):
        direction = "desc" if desc else "asc"
        self.order_params = {"column": column, "direction": direction}
        return self
    
    def eq(self, column: str, value: Any):
        self.eq_filters[column] = value
        return self
    
    def execute(self) -> Dict[str, Any]:
        url = f"{self.client.url}/rest/v1/{self.table_name}"
        
        params = {}
        if "select" in self.query_params:
            params["select"] = self.query_params["select"]
        
        if self.order_params:
            params["order"] = f"{self.order_params['column']}.{self.order_params['direction']}"
        
        if self.limit_val:
            params["limit"] = str(self.limit_val)
        
        # Add eq filters
        for column, value in self.eq_filters.items():
            params[column] = f"eq.{value}"
        
        response = requests.get(url, headers=self.client.headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        return {"data": result, "error": None}

# Initialize custom Supabase client
supabase = SimpleSupabaseClient(supabase_url, supabase_key)

async def store_debate(query, right_response, left_response):
    """Store a debate in the Supabase database"""
    data = {
        "query": query,
        "right_wing_response": right_response,
        "left_wing_response": left_response
    }
    try:
        result = supabase.table("debates").insert(data)
        return result["data"]
    except Exception as e:
        print(f"Error storing debate: {e}")
        raise

async def get_recent_debates(limit=10):
    """Get the most recent debates"""
    try:
        result = supabase.table("debates").select("*").order("created_at", desc=True).limit(limit).execute()
        return result["data"]
    except Exception as e:
        print(f"Error fetching recent debates: {e}")
        return []

async def get_debate_by_id(debate_id):
    """Get a specific debate by ID"""
    try:
        result = supabase.table("debates").select("*").eq("id", debate_id).execute()
        data = result["data"]
        return data[0] if data else None
    except Exception as e:
        print(f"Error fetching debate by ID: {e}")
        return None 