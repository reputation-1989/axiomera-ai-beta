# AGENTS.md

## Project Directives for AxiomeraAI

This project has strict requirements regarding its design philosophy and engineering standards.

### 1. The "Verification-First" Mindset
*   **Do not optimize for speed.** If a solution seems "fast but maybe flaky," reject it. We want robust answers.
*   **Simulate Adversarial Thinking.** When implementing the backend logic, always ask: "How would a critic break this answer?"

### 2. Frontend & UX Guidelines
*   **NO GENERIC CHAT UIs.** Do not build a standard "user bubble on right, bot bubble on left" interface.
*   **Visualize the Process.** The user must see that work is happening. Show the *phases* of thought (e.g., "Model A proposing...", "Model B critiquing...", "Synthesizing...").
*   **Aesthetics:** "Elegant, modern, distinct." Think "High-end analytical tool," not "chatbot." Use dark modes, crisp typography, and subtle, purposeful animations.

### 3. Engineering Standards
*   **Backend:** Use strict typing (Pydantic models) for all data exchanges between the council members.
*   **Frontend:** Ensure accessibility, but prioritize the visual narrative of the "Council."
*   **Testing:** We are building a verification engine; our own code must be verified.

### 4. Tools
*   **Backend:** Python / FastAPI
*   **Frontend:** Next.js / Tailwind / Framer Motion
