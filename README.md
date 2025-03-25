# Political Debate AI Agents

A web application that simulates political debates between AI agents representing different political perspectives. When users submit political questions, the system presents responses from both conservative and progressive viewpoints.

## Features

- **AI-Powered Debate**: Uses GPT-4o to generate responses representing both Donald Trump (right-wing) and Joe Biden (left-wing) perspectives
- **Interactive UI**: Modern web interface with real-time responses
- **Debate History**: Stores and displays past debates for reference
- **Research Capability**: AI agents use web search to gather factual information for responses

## Project Structure

The project consists of two main components:

### Backend (FastAPI)

- Built with FastAPI and Pydantic AI
- Uses OpenAI's GPT-4o for generating responses
- Stores debate history in Supabase database

### Frontend (Next.js)

- Modern UI built with Next.js and Tailwind CSS
- Real-time response visualization
- Mobile-responsive design

## Technical Architecture

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│  Next.js UI     │ ───────►│  FastAPI        │
│  (debate-ui)    │         │  Backend        │
│                 │◄────────│                 │
└─────────────────┘         └─────────────────┘
                                    ▲
                                    │
                                    ▼
                            ┌─────────────────┐
                            │                 │
                            │  OpenAI API     │
                            │                 │
                            └─────────────────┘
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 16+
- OpenAI API key
- Supabase account and project

### Backend Setup

1. Clone the repository

   ```
   git clone https://github.com/yourusername/pydantic-ai-agents.git
   cd pydantic-ai-agents
   ```

2. Create and activate a virtual environment

   ```
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies

   ```
   pip install -r app/requirements.txt
   ```

4. Create a .env file (copy from .env.example)

   ```
   cp .env.example .env
   ```

5. Add your API keys to the .env file

   ```
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

6. Start the backend server
   ```
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory

   ```
   cd debate-ui
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Create a .env.local file

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the development server

   ```
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Deployment

### Deploying the Backend to Render

1. Push your code to GitHub
2. Create a new Web Service in Render
3. Connect to your GitHub repository
4. Configure as follows:
   - Environment: Python
   - Build Command: `pip install -r app/requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`

### Deploying the Frontend

1. Set the NEXT_PUBLIC_API_URL to your deployed backend URL
2. Deploy the Next.js app to Vercel or Netlify

## How It Works

1. User submits a political question through the UI
2. The question is sent to the FastAPI backend
3. Two AI agents (right-wing and left-wing) generate responses
4. The agents can use web search to gather relevant information
5. Responses are returned to the frontend and displayed side-by-side
6. The debate is saved in the database for future reference

## License

[MIT License](LICENSE)

## Contributors

- Your Name - Initial work
