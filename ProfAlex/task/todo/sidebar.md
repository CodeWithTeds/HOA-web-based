### ADMIN SIDEBAR UPDATE PROMPT

**Goal:** 
Update the `AppSidebar` component to include the full Admin menu hierarchy. **IMPORTANT:** This menu is strictly for the `ADMIN` role only. It must be hidden and inaccessible to `STAFF` or `HOMEOWNER` roles.

---

### 1. MENU STRUCTURE (ADMIN ONLY)
Implement the following navigation items in `mainNavItems`. Use conditional logic to ensure these are only rendered when `auth.user.role === UserRole.ADMIN`:

*   **Dashboard** (Icon: `LayoutGrid`)
*   **User Management** (Icon: `Users`) - Manage admin and staff accounts.
*   **Resident Management** (Icon: `Home`) - Homeowner and tenant records.
*   **Billing and Collection** (Icon: `CreditCard`) - Invoices, dues, and payments.
*   **Reports and Analytics** (Icon: `BarChart3`) - Financial and community reporting.
*   **Facility Management** (Icon: `Settings2`) - Clubhouse, pool, and amenity bookings.
*   **Announcements** (Icon: `Megaphone`) - Community news and alerts.
*   **Complaints Management** (Icon: `AlertCircle`) - Handling resident issues.
*   **Chat Support** (Icon: `MessageSquare`) - Communication with homeowners.
*   **System Settings** (Icon: `ShieldCheck`) - App-wide configurations.

### 2. DESIGN SPECIFICATIONS (COLOR PALETTE)
*   **Background:** Use the primary neutral white/off-white (`bg-white` or `bg-zinc-50`).
*   **Text/Icons:** Dark secondary gray/black (`text-zinc-900` for active, `text-zinc-500` for inactive).
*   **Accent:** Subtle Apple-blue or soft gray for hover states and active indicators (`bg-blue-50/50` or `bg-zinc-100`).
*   **Borders:** Use very light borders (`border-zinc-200/50`).
*   **Roundedness:** `rounded-xl` for menu item highlights.

### 3. SECURITY & VISIBILITY
*   **Role Restriction:** The entire `mainNavItems` array (or the specific admin items) must be wrapped in a conditional check: `auth.user.role === UserRole.ADMIN`.
*   **Zero Visibility:** Staff and Homeowners should not see any of these administrative links. If they try to access the Admin dashboard URL directly, they should be redirected back to their respective landing pages.

### 4. TECHNICAL REQUIREMENTS
*   **Icon Library:** Use `lucide-react`.
*   **Conditional Rendering:** Ensure these items only show when `auth.user.role === UserRole.ADMIN`.
*   **Link Handling:** Use Inertia `<Link>` for all navigation items.
*   **State:** Ensure the `active` state correctly highlights the current route.

### GLOBAL INSTRUCTION FOR ASSISTANT:
"Refactor the AppSidebar to handle full Admin navigation. Organize the items into logical groups if necessary. Use subtle micro-animations for hover states (slight scale or opacity shift). Ensure the sidebar is fully responsive and feels like a native macOS sidebar interface—clean, functional, and aesthetically pleasing."
