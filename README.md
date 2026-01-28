# AxiomeraAI

**AxiomeraAI** is a verification-first AI system designed to produce answers that are hard to break. It moves beyond single-model generation by employing a "Council" of models that reason independently, cross-critique, test, and iteratively converge toward the strongest possible output.

## Core Philosophy
*   **Verification over Confidence:** Answers must earn trust through scrutiny.
*   **Explicit Disagreement:** Conflict between models is utilized to find flaws.
*   **Correctness > Speed:** Latency is secondary to reliability.

## Architecture

The project is structured as a monorepo:

### Backend (`/backend`)
*   **Role:** Orchestration Engine.
*   **Tech Stack:** Python, FastAPI.
*   **Responsibilities:**
    *   Managing the "Council Mode" workflow (Parallel Reasoning -> Critique -> Convergence).
    *   Interfacing with LLM APIs (OpenAI, Anthropic, etc.).
    *   Running verification tests (code execution, logic checks).

### Frontend (`/frontend`)
*   **Role:** The User Experience.
*   **Tech Stack:** Next.js (React), Tailwind CSS, Framer Motion.
*   **Responsibilities:**
    *   Visualizing the reasoning process (making the "thinking" visible).
    *   Providing a distinct, elegant, and non-generic interface.
    *   Displaying the final synthesized answer.

## Workflow (The "Council")
1.  **Parallel Reasoning:** Multiple models generate initial hypotheses.
2.  **Cross-Critique:** Models analyze each other's outputs for errors.
3.  **Refinement & Testing:** Solutions are revised and, where applicable, tested.
4.  **Convergence:** A final answer is synthesized from the surviving hypotheses.

## Setup Instructions

*(To be added as development progresses)*
