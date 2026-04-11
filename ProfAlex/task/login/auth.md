You are a senior full-stack developer working with Laravel and React (Vite-based setup).

**CRITICAL: You MUST follow the architecture and coding standards defined in: `ProfAlex/task/AIGuide/codingstandard.md`.**

Your task is to design and structure a modern login page UI while integrating with Laravel’s built-in authentication system.

---

1. Context Awareness (IMPORTANT)

- Backend: Laravel handles authentication (routes, controllers, validation)
- Frontend: React handles UI rendering
- Use existing Laravel auth routes (e.g., POST /login)
- Do NOT recreate authentication logic — only UI + integration

---

2. Layout Structure

- Create a split-screen login layout:
  - LEFT: Image / branding section
  - RIGHT: Login form
- Mobile:
  - Stack vertically (image top, form bottom)

---

3. File Structure (Separation of Concerns)

- resources/js/Pages/Auth/Login.jsx
- resources/js/Components/Auth/LoginForm.jsx
- resources/js/Components/UI/InputField.jsx
- resources/js/Layouts/AuthLayout.jsx

- Keep layout, UI, and logic separated
- Reusable components required

---

4. LEFT SIDE (Image Section)

- Full-height image (object-cover)
- Add dark gradient overlay
- Include:
  - Title: "Welcome Back"
  - Subtitle: "Manage your HOA system efficiently"

---

5. RIGHT SIDE (Login Form)

- Centered vertically
- Include:
  - System logo or name
  - Heading: "Sign in to your account"
  - Email input
  - Password input
  - Remember me checkbox (optional)
  - Login button
  - Forgot password link (connect to Laravel route)

- Form must:
  - Submit to Laravel backend (/login)
  - Use axios or Inertia (depending on setup)

---

6. Styling (Tailwind CSS ONLY)

- Use Tailwind (already installed in Laravel)
- No external CSS

---

7. Apple / MacBook Design Style

Typography:
- Use:
  "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

UI Style:
- Minimal, clean, premium
- Rounded corners (rounded-xl to 2xl)
- Soft shadows (shadow-md)
- Subtle borders (border-gray-200)
- Smooth transitions

---

8. Color Palette (STRICT)

- White / Off-white
- Black / Dark Gray
- One subtle accent (blue or gray)
- No more than 3 colors total

---

9. Responsiveness

- Mobile-first
- Use Tailwind breakpoints
- Ensure clean stacking behavior

---

10. Integration Notes

- Use Laravel CSRF token if needed
- Follow Laravel validation error display
- Show error messages under inputs
- Disable button while submitting

---

Goal:

Create a clean, Apple-style login UI that integrates seamlessly with Laravel’s authentication system while keeping code modular and maintainable.