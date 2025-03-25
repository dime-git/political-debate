#!/bin/bash
# Use the PORT environment variable if set by the platform, otherwise default to 8000
PORT=${PORT:-8000}
uvicorn app.main:app --host 0.0.0.0 --port $PORT 