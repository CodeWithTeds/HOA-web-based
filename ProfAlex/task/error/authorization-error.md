### ISSUE: Incorrect Admin Login Redirection

**Description:**
When logging in as an `ADMIN` user, the system inappropriately redirects to `/staff/dashboard` instead of `/admin/dashboard`. This occurs because:
1.  The `intended()` redirect logic in `LoginResponse` may be using a legacy "intended" URL from the session.
2.  The routes currently lack role-based middleware protection, allowing cross-role access.

---

### FIX PLAN (TO BE EXECUTED):

#### 1. UPDATE LOGIN RESPONSE
Modify `app/Http/Responses/LoginResponse.php` to use a direct redirect instead of `intended()`. This ensures users always land on their role-specific dashboard immediately after login.

#### 2. IMPLEMENT ROLE MIDDLEWARE
Create or utilize a middleware to protect the `/admin/*` and `/staff/*` routes.
*   **Admin Routes:** Only accessible by `UserRole::ADMIN`.
*   **Staff Routes:** Only accessible by `UserRole::STAFF` (and optionally `ADMIN`).
*   **Redirect Logic:** Unauthorized access should redirect to the user's correct dashboard.

#### 3. UPDATE WEB ROUTES
Apply the role middleware to the routes in `routes/web.php`.

---

### EXECUTION STEPS (COMPLETED):
1.  **Fixed `LoginResponse.php`**: Changed `intended()` to `redirect()` to ensure immediate role-specific dashboard access.
2.  **Verified `UserRole` Enum**: Confirmed consistency and fixed a TypeScript export syntax error in `index.ts`.
3.  **Implemented `CheckRole` Middleware**: Created new middleware to enforce role access.
4.  **Applied Route Protection**: Updated `web.php` to wrap Admin and Staff routes in the `role` middleware.