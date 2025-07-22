# Supplemental Editing & Overlay Enhancement – Implementation Plan

## 0. Pre-flight
A. Sync with `main` / latest branch, ensure lint passes.
B. Confirm Tailwind warm palette + button utilities are merged.

---

## 1. Supplemental Info – CRUD parity with Prompts
1.1 **Backend**
  a. Add `update_item` & `delete_item` endpoints to `routes/supplementals.py` (PUT, DELETE) if missing.
  b. Ensure CORS / auth unchanged.

1.2 **Frontend Components**
  a. Create `EditableSupplementCard.tsx` mirrored from `EditablePromptCard`.
  b. Include Edit & Delete buttons; open existing `SupplementModal` pre-filled.

1.3 **SupplementalInfoPage.tsx**
  a. Map `EditableSupplementCard` instead of static card.
  b. Pass handlers to update local state after save / delete.

---

## 2. Replace textarea resize with “Expand” overlay
2.1 **Global UX**
  a. Hide native resize (`resize-none`) on all `<textarea>`.
  b. Add small “Expand” icon/button bottom-right.

2.2 **Overlay Component** (`TextEditorOverlay`)
  a. Full-viewport dark backdrop (`fixed inset-0 bg-black/50 z-[120]`).
  b. Centered white card (max-w-4xl) with padding.
  c. Contains:
     • Title & close (X)
     • Chatbot header (see §3)
     • Large textarea (auto-grow) bound to same state via prop callbacks.

2.3 **Integration**
  a. Wrap every textarea needing expand (Prompts, Supplementals, GenerateForm instructions, etc.) with a new `ExpandableTextarea` component that houses local “Expand” button + overlay portal.

---

## 3. Chatbot assistant inside overlay
3.1 **ChatbotContainer**
  a. Props: `mode` (`"prompt" | "supplement"`), `onRefine(newText)`.
  b. UI: gradient icon, title, scrollable message pane, input box, Send button.

3.2 **Default system prompts**
  a. For **Prompt mode**: “You help users craft high-quality AI prompts…”.
  b. For **Supplement mode**: “You help users summarise / rephrase supplement text…”.

3.3 **Backend endpoint**
  a. Add `/assistant/refine` route accepting `{mode,text}` returning suggested improvement.
  b. Call appropriate OpenAI prompt (system + user text).

3.4 **Wire up**
  a. `ChatbotContainer` hits `/assistant/refine` and emits refined text via `onRefine` back to textarea.

---

## 4. System Settings
4.1 **Header**
  a. Add gear icon top-right; opens settings modal.

4.2 **Settings Modal**
  a. Tabs: `System Prompts`, `Preferences` (future).
  b. Two textareas for default Prompt & Supplement system prompts (uses `ExpandableTextarea`).
  c. Save triggers PUT `/settings` backend route storing to JSON.

4.3 **Backend**
  a. `utils/settings_store.py` (similar to prompt_store) with get/update.
  b. `routes/settings.py` GET & PUT.

4.4 **State**
  a. On app load, fetch settings & provide via React context.
  b. ChatbotContainer pulls system prompt from context.

---

## 5. Refactor / Reusables
5.1 Promote `btn`, `overlay`, `chatbot` components to `src/ui` folder.
5.2 Ensure all new buttons use `btn-primary` / `btn-danger` utilities.

---

## 6. QA & polish
6.1 Unit test stores (Jest) & React components (React Testing Library).
6.2 Manual check mobile breakpoints, dark backdrop scroll lock.
6.3 Lint, format, rename file paths if needed.

---

## 7. Deliverables
• New/updated backend routes & stores.
• Components: `EditableSupplementCard`, `ExpandableTextarea`, `TextEditorOverlay`, `ChatbotContainer`, `SettingsModal`.
• Updated pages & header.
• Tailwind classes / global styles untouched.

---

> Total est. effort: ~6-8 hrs dev + 1 hr QA.

Awaiting approval to proceed 🚀 