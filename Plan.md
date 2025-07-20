🧠 Rugs AI Partner – Fullstack App Build Plan

A comprehensive, step-by-step development roadmap for building a modern, full-featured rug content generation app with UI, using FastAPI (backend) and React + Tailwind (frontend). This file will guide all development stages. Execute each section fully before moving on.

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

