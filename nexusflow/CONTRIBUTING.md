# Contributing to NexusFlow

First off, thank you for considering contributing to NexusFlow! It's people like you that make this AI-orchestrated platform better.

## Development Workflow

1. **Fork & Clone:** Fork the repository and clone it to your local machine.
2. **Branching:** Create a new branch for your feature or bugfix (e.g., `git checkout -b feature/advanced-llm-parsing`).
3. **Local Setup:** 
   - **Backend:** Create a Python virtual environment, install `requirements.txt`, and run via `uvicorn`.
   - **Frontend:** Run `npm install` and `npm run dev`.
4. **Code Quality Standards:**
   - Ensure all new Python endpoints include type hints and Pydantic models.
   - Ensure all new Next.js components are strictly typed with TypeScript.
5. **Testing:**
   - Run `pytest` in the backend directory.
   - Run `npm test` in the frontend directory.
   - Ensure all tests pass before opening a Pull Request.

## Pull Request Process

1. Commit your changes with clear, descriptive commit messages.
2. Push your branch to your fork.
3. Open a Pull Request against the `main` branch.
4. Ensure your PR description clearly states the problem you are solving and the proposed solution. Link any relevant issues.
5. A project maintainer will review your code. You may be asked to make some changes before it is merged.

Thank you for your contributions!
