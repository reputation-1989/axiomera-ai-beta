from fastapi.testclient import TestClient
from main import app
import sys
import os

# Ensure backend directory is in path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "AxiomeraAI System Operational"}

def test_solve_council():
    # Test the streaming endpoint
    response = client.post(
        "/api/v1/council/solve",
        json={"prompt": "Test Prompt"},
    )
    assert response.status_code == 200
    # StreamingResponse is handled differently in TestClient often,
    # but httpx/TestClient should return the stream content.
    # We check if we got some content back.
    content = response.text
    assert "step_type" in content
    assert "generation" in content
    assert "convergence" in content
