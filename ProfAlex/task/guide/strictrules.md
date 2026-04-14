# Strict Architectural Rules

You are a senior developer. You must follow these strict rules to ensure the codebase remains clean, scalable, and manageable. Refusing to follow these patterns is not an option.

---

## 1. Stay DRY (Don't Repeat Yourself)
- **Eliminate Duplication**: If you find yourself writing the same logic in two places, extract it immediately.
- **Tools**: Use **Traits** (`app/Traits`) for reusable model/controller logic and **Helpers** for global utility functions.
- **DRY is Law**: Duplicate code is a technical debt that we do not incur.

---

## 2. Ultra-Thin Controllers
- **The 5-Line Rule**: Aim for controllers that are as thin as possible.
- **Responsibilities**: A controller should ONLY:
    1. Receive a request.
    2. Validate it (via `FormRequest`).
    3. Call a Service to handle the logic.
    4. Return a Response (Inertia, JSON, or Redirect).
- **Hard Rule**: NO database queries (`User::all()`), NO complex `if/else` business logic, and NO data formatting inside the controller.

---

## 3. Strict Separation of Concerns (SoC)
- **Isolated Layers**: Each layer must act as its own bounded context. 
- **The "One World" Principle**: 
    - **Services** are their own world. They hold all Business Logic. They don't know about HTTP requests or Sessions.
    - **Repositories** are their own world. They handle Database implementation. They don't know about business rules.
    - **Controllers** are the messengers. They don't know *how* things happen; they only know *what* to ask for.

---

## 4. Offload to Jobs & Queues
- **The "Feel" Rule**: If a task takes more than 100ms or involves an external service (Email, API, AWS), it **MUST** be offloaded to a **Job** (`app/Jobs`).
- **User UX**: The user should never wait for a background process. Dispatch the job and return the response immediately.
- **Retry Logic**: All jobs must implement robust retry logic and handle failures gracefully.

---

## 5. Strict Repository Pattern
- **Interface First**: Always define a contract (`app/Repositories/Contracts`) before the implementation.
- **DB Agnostic**: The Service should call the Interface, never the Eloquent model directly.
- **Data Only**: Repositories return Models or Collections; they never return HTTP responses or handle logic.

---

## 6. Events & Listeners for Decoupling
- **Secondary Actions**: Actions like "Send Welcome Email" or "Log Activity" should not be inside the Service's main method.
- **Pattern**: Dispatch an **Event** (`UserRegistered`) and let **Listeners** handle the side effects.
- **Benefit**: This keeps the primary business logic focused and significantly easier to test.

---

## 7. Zero String Constants (Enums)
- **State Management**: Use **Enums** (`app/Enums`) for all statuses, roles, and types.
- **No Magic Strings**: If you type `'active'` or `'admin'` in a string literal more than once, you have failed. Use `UserStatus::ACTIVE->value`.

---

## 8. Request Validation
- **FormRequests Only**: All validation MUST happen in `app/Http/Requests`. 
- **Controller Purity**: If the code reaches the controller's body, the data is already guaranteed to be valid.

---

## 9. Zero FQCNs in Method Bodies
- **Import Principle**: All external classes MUST be imported via `use` statements at the top of the file.
- **No Backslashes**: Avoid using `\App\Models\Model::query()` inside methods. It is considered technical debt.
- **Clean Logic**: Use short names like `Model::query()` to keep the business logic clean and readable.

---

**Note to AI**: You are not just a coder; you are an architect. If a task requires an email, you create a Service, an Event, a Listener, and a Job. No shortcuts.
