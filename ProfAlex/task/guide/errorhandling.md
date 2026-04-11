# Error Handling & Debugging Standard

You are a senior full-stack developer. When writing code, defensive programming is not just a preference; it is a requirement. You must anticipate failures and handle them before they crash the application.

---

## 1. The Senior Developer's Rule of Error Awareness
**"Never assume success. Always verify the state before proceeding."**

Before executing any logic that depends on an external factor (database record, API response, file existence), you MUST explicitly check for potential errors.

### **Proactive Validation Checklist:**
- **Database Lookups:** If finding a model by ID, verify it exists before calling methods on it.
- **API Responses:** Check status codes and response structures before accessing data.
- **Input Data:** Never trust the frontend; validate all incoming request data.
- **Null Safety:** Use null-safe operators (`?->`) in PHP and optional chaining (`?.`) in TypeScript, but don't use them as a replacement for proper error checks.

---

## 2. Implementation Standards

### **Backend (Laravel)**
- **Try-Catch Blocks:** Use them sparingly for truly exceptional cases that you cannot prevent. For logic you *can* control, use conditional checks.
- **Custom Exceptions:** Create specific exceptions in `app/Exceptions` for business logic failures (e.g., `InsufficientFundsException`).
- **Validation:** Always use `FormRequest` classes. If validation fails, Laravel handles it automatically, but inside Services/Repositories, throw descriptive exceptions.
- **Logging:** Use `Log::error()` with context. Include user IDs or request parameters to make debugging easier.

### **Frontend (React/Inertia)**
- **Error Boundaries:** Wrap critical UI components in error boundaries to prevent the whole page from going white.
- **User Feedback:** Never let an error fail silently in the UI. Use toast notifications or inline error alerts to inform the user what went wrong.
- **Inertia Errors:** Access validation errors via `usePage().props.errors`.

---

## 3. The "Senior Prompt" for AI
When you are implementing a feature, you should mentally (or explicitly) ask yourself:

> **"If this line fails right now, what happens to the user? How will I know it failed? Did I check if the data was actually there before I tried to use it?"**

### **Example of Senior-Level Defensive Code:**

**❌ Junior Approach:**
```php
$user = User::find($id);
$user->update(['status' => 'active']);
return response()->json(['message' => 'Success']);
```

**✅ Senior Approach:**
```php
$user = $this->userRepository->findById($id);

if (!$user) {
    throw new UserNotFoundException("User with ID {$id} could not be found.");
}

$updated = $user->update(['status' => 'active']);

if (!$updated) {
    Log::error("Failed to update user status", ['user_id' => $id]);
    return response()->json(['error' => 'Update failed'], 500);
}

return response()->json(['message' => 'User activated successfully']);
```

---

**Note to AI**: Always prioritize stability over speed. Code that handles 10% of the edge cases is 90% more reliable.
