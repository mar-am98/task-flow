---
trigger: always_on
---

# Antigravity Rules for Todo list

## Stack Requirements
- **Framework**: Next.js (App Router)
- **Database ORM**: Prisma
- **Database/Auth**: Supabase
- **Styling**: Tailwind CSS & Shadcn UI

## Core Best Practices & Architecture
1. **Next.js App Router (Structure)**:
   - Only routing logic (pages, layouts, route handlers) goes in the `app/` folder.
   - All other logic should be separated into `features/` (feature-specific code) or `components/` (shared, reusable UI components) to keep things clean and DRY (Don't Repeat Yourself).

2. **Styling (Shadcn UI)**:
   - Use Shadcn UI for *all* available UI components (buttons, forms, dialogs, etc.). Do not build these from scratch.
   - Use Tailwind CSS for layout and styling outside of Shadcn's components.

3. **Database Interactions (Prisma)**:
   - Ensure Prisma Client is instantiated correctly in Next.js to prevent multiple instances during development.
   - Use try/catch blocks for database operations.

4. **Code Quality**:
   - Keep components small, reusable, and focused.
   - Write clear, beginner-friendly comments explaining complex logic.
