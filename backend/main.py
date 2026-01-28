from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import asyncio
from models import CouncilRequest
from council import run_council

app = FastAPI(title="AxiomeraAI Backend")

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AxiomeraAI System Operational"}

@app.post("/api/v1/council/solve")
async def solve(request: CouncilRequest):
    async def event_generator():
        async for step in run_council(request):
            # Send data as Server-Sent Events (SSE) format or simple JSON lines
            # Using JSON lines for simplicity in parsing on frontend for now
            yield json.dumps(step.model_dump()) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
