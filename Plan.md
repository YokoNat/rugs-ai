🧠 Rugs AI Partner – Fullstack App Build Plan

A comprehensive, step-by-step development roadmap for building a modern, full-featured rug content generation app with UI, using FastAPI (backend) and React + Tailwind (frontend). This file will guide all development stages. Execute each section fully before moving on.

# 🧩 ADVANCED FEATURE IMPLEMENTATION PLAN

This section outlines the step-by-step plan for building the core features described for Rugs AI Partner. Reference this before and during development.

---

## 0. CORE FEATURE OVERVIEW

- **Project Management**: Users can create, title, and manage projects. Each project can have custom instructions and planning.
- **Prompt Management**: Prompts are organized by category (pillar, category, blog, other). Users can save, edit, and select prompts for content generation. System prompt is modifiable here.
- **Content Generation Types**: Support for pillar pages, category pages, blogs, and other (FAQ, About, Contact, etc.).
- **Keyword Handling**: Users can input keywords (txt file or comma-separated), or auto-generate keywords from the article title.
- **Critique/Edit Loop**: Button to critique content, feed feedback back into the editor, and allow revision.

---

## 1. PROJECT MANAGEMENT

1.1. Add a Projects tab/page in the frontend UI.
1.2. Implement project creation (title, description, custom instructions, planning fields).
1.3. List all projects, allow selection, editing, and deletion.
1.4. Store projects in backend DB or file (start with file-based, migrate to DB if needed).

## 2. PROMPT MANAGEMENT

2.1. Create a Prompts section/page/tab in the UI.
2.2. Allow users to add, edit, delete, and categorize prompts (pillar, category, blog, other).
2.3. Allow saving prompts to categories and selecting a prompt for content generation.
2.4. Make system prompt modifiable in this section.
2.5. Store prompts in backend (file or DB).

## 3. CONTENT GENERATION TYPES

3.1. In project or content creation UI, let user select content type: Pillar, Category, Blog, Other (FAQ, About, Contact, etc.).
3.2. Show relevant prompt options based on type.
3.3. Route generation requests to correct backend logic.

## 4. KEYWORD HANDLING

4.1. Add keyword input field (accepts txt file upload or comma-separated list).
4.2. Add "Generate Keywords" button: uses article title to auto-generate 10-20 keywords (via AI backend call).
4.3. Populate keyword field with generated keywords, allow user to edit.

## 5. CRITIQUE/EDIT LOOP

5.1. Add "Critique Content" button in editor view.
5.2. On click, send content to backend critique endpoint, receive feedback.
5.3. Display feedback and allow user to accept suggestions (auto-edit) or revise manually.
5.4. Log all critiques and edits for history/debug.

## 6. DATA STORAGE

6.1. Store all projects, prompts, and content in backend (start with file-based, migrate to DB if needed).
6.2. Ensure all user data is persistent and retrievable.

## 7. UI/UX

7.1. Keep UI simple and intuitive: tabs for Projects, Prompts, Content Generation, History.
7.2. Use modals or sidebars for editing/creating projects, prompts, and content.
7.3. Provide clear feedback and error handling throughout.

---

> **This plan is a living document. Update as features evolve.**

---

✅ 1. PROJECT STRUCTURE SETUP

📁 File Structure Checklist (initial scaffold):

rugs_ai_partner/
├── plan.md                    # ← This file
├── main.py                   # CLI entry (keep for debugging)
├── prompts/
│   └── system.txt
├── scripts/
│   ├── generate.py
│   └── critique.py
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── generate.py
│   │   │   └── critique.py
│   │   └── utils/
│   │       └── ai_tools.py    # Calls OpenAI, Gemini, etc.
├── frontend/
│   └── ... (React frontend)
├── .env                      # API keys (OpenAI, Gemini, etc.)
└── requirements.txt

📌 Tasks:



✅ 2. BACKEND – FASTAPI SETUP

✨ Features:

POST /generate → Takes topic & instructions, returns markdown article

POST /critique → Takes markdown file, returns critique suggestions

📌 Tasks:

- [ ] Create backend/app/main.py and initialize FastAPI app
- [ ] Create backend/app/routes/generate.py with POST /generate route
- [ ] Create backend/app/routes/critique.py with POST /critique route
- [ ] Implement backend/app/utils/ai_tools.py to wrap generation and critique logic
- [ ] Connect /generate route to scripts/generate.py logic
- [ ] Connect /critique route to scripts/critique_content.py logic
- [ ] Add Pydantic models for request/response validation
- [ ] Test both endpoints with sample requests

✅ 3. BACKEND – AI LOGIC INTEGRATION

📌 Tasks:



✅ 4. FRONTEND – REACT SETUP

📌 Tasks:



frontend/src/
├── components/
├── pages/         (or App.jsx / routes)
├── utils/
├── styles/
└── App.tsx / App.jsx

✅ 5. FRONTEND – PAGE & COMPONENT SETUP

Pages:



Components:



✅ 6. FRONTEND – CONNECT TO FASTAPI

📌 Tasks:



✅ 7. TESTING & DEPLOYMENT

📌 Tasks:



✅ 8. FUTURE FEATURES (Append to this list)



📌 NOTES

Keep system prompt modular per tool (one per route)

Save all outputs in content/ folder for history

Keep UX super simple. Users click → get instant result.

Log every generation/critique to console for debug

