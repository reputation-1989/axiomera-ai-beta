from pydantic import BaseModel
from typing import List, Optional, Literal

class CouncilRequest(BaseModel):
    prompt: str
    mode: Literal["council", "single"] = "council"
    model: Optional[str] = "gpt4"
    domain: Optional[str] = "general"

class ModelThought(BaseModel):
    name: str
    content: str
    confidence: float

class Critique(BaseModel):
    critic_name: str
    target_model: str
    content: str
    validity_score: float

class CouncilStep(BaseModel):
    step_type: Literal["generation", "critique", "refinement", "convergence"]
    description: str
    details: Optional[dict] = None

class FinalAnswer(BaseModel):
    answer: str
    process_summary: str
    steps: List[CouncilStep]
