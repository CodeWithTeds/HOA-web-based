# AI Coding Standard & Architecture Guide

You are a senior full-stack developer. When generating code for this project, you MUST adhere to the following architectural patterns and principles. Your goal is to produce clean, maintainable, and task-focused code.

---

## 1. Core Philosophy

- **Task-Based Implementation**: Do NOT over-engineer. Only implement what is required for the specific task.
- **Lazy Abstraction**: Only use the layers below if the complexity of the task justifies it.
- **Separation of Concerns**: Each class should have a single responsibility.

---

## 2. Layered Architecture

### **Services (`app/Services`)**
- Use for **Business Logic** and complex rules.
- Services should handle the "How" of the business process.
- Controllers should call Services, not implement logic.

### **Repositories (`app/Repositories`)**
- Use for all **Database Interactions**.
- **Organization**: Separate by folder based on implementation (e.g., `Contracts/`, `Eloquent/`).
- Example: `app/Repositories/User/EloquentUserRepository.php` implementing `app/Repositories/User/UserRepositoryInterface.php`.

### **Traits (`app/Traits`)**
- Use for **Repetitive Patterns** shared across multiple classes (Models, Controllers, or Services).
- Common examples: `HasUuid`, `ApiResponseTrait`, `Uploadable`.

### **Request Forms (`app/Http/Requests`)**
- Use for **Input Validation** and authorization of the request itself.
- Never put validation logic inside Controllers.

### **Enums (`app/Enums`)**
- Use for any **Statuses, Types, or Fixed Constants**.
- Avoid hardcoded strings or integers for status checks.
- Example: `TaskStatusEnum::PENDING`.

### **Resources (`app/Http/Resources`)**
- Use for **API Response Formatting**.
- Ensure consistent data structures for the frontend.

### **Jobs & Queues (`app/Jobs`)**
- Use for **Background Tasks** or heavy processing (e.g., sending bulk emails, image processing).
- Keep the user experience fast by offloading non-immediate tasks.

### **Policies (`app/Policies`)**
- Use for **Authorization Logic** (e.g., `can-update-task`).
- Encapsulate who can perform which action on a model.

### **Notifications & Mail (`app/Notifications` / `app/Mail`)**
- Use for system alerts, emails, or SMS.
- Keep delivery logic out of the core business flow.

### **Exceptions (`app/Exceptions`)**
- Use **Custom Exceptions** for specific business failure cases.
- Use a central global handler or catch-block in services to manage these.

### **Events & Listeners (`app/Events` / `app/Listeners`)**
- Use to **Decouple Side Effects**.
- Example: `UserRegistered` event -> `SendWelcomeEmail` listener.

---

## 3. Implementation Rules

1. **Interacting with Database**: Always use **Repositories**.
2. **Business Rules**: Always use **Services**.
3. **Repeated Logic**: Extract to **Traits**.
4. **Input Handling**: Always use **Request Forms**.
5. **State Management**: Always use **Enums**.
6. **Side Effects**: Use **Events/Listeners** or **Jobs/Queues**.

---

## 4. Folder Structure Standards

Maintain a clean folder hierarchy:
- `app/Repositories/{Domain}/{Implementation}`
- `app/Services/{Domain}`
- `app/Enums`
- `app/Traits`

---

**Note to AI**: Always scan the existing codebase to ensure you are following the established naming conventions and patterns. If a pattern isn't needed for a simple task, stay lean, but if the task grows, use these layers to maintain order.
