from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Initialize API configurations before importing other modules
from app.setup import setup_api_keys
config = setup_api_keys()

# Now import the modules that depend on API configurations
from app.debate.service import analyze_profile
from app.database import get_recent_debates, get_debate_by_id

app = FastAPI(
    title="Debate AI API",
    description="An API for political debate simulation",
    version="1.0.0"
)

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local development
        "https://political-debate-nu.vercel.app",  # Replace with your actual frontend domain
        "https://political-debate.vercel.app",  # Vercel domain
        "https://political-debate-ai-agents.vercel.app",  # Alternative Vercel domain
        "*"  # Temporarily allow all origins while testing
    ],  
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Debate AI API", "config": config}

@app.get('/debate')
async def pass_in_debate_data(query: str):
    result = await analyze_profile(query)
    return result

@app.get("/debates")
async def get_debates(limit: int = 10):
    """Retrieve recent debates from the database"""
    debates = await get_recent_debates(limit)
    return {"debates": debates}

@app.get("/debates/{debate_id}")
async def get_debate(debate_id: str):
    """Retrieve a specific debate by ID"""
    debate = await get_debate_by_id(debate_id)
    if not debate:
        raise HTTPException(status_code=404, detail="Debate not found")
    return debate