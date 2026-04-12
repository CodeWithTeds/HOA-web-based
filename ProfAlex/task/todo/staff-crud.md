Task: Create Staff
use the img as reference
Description:
Implement a Create Staff feature in the USER MANAGEMENT module. This allows an admin user to add a new staff member into the system based on the provided input fields.

Access Control:
- Only users with role = "admin" can perform this action

Functional Requirements:
- Accept staff data from a form (based on UI/image reference)
- Validate required fields before submission
- Ensure email is unique
- Save the new staff record to the database
- Automatically assign:
  - createdBy (admin userId)
  - createdAt (timestamp)
  - updatedAt (timestamp)
- Return the created staff data after success

Validation:
- firstName: required, minimum 2 characters
- lastName: required, minimum 2 characters
- email: required, must be valid format, must be unique
- role: must be one of ["secretary", "hoa personnel"]
- status: must be one of ["ACTIVE", "INACTIVE"]
- hireDate: required, valid date

Staff:
- id: UUID (primary key)
- profilePicture: string (optional)
- firstName: string (required)
- lastName: string (required)
- email: string (required, unique)
- phone: string (optional)
- role:
- department: string (optional)
- status: enum ["ACTIVE", "INACTIVE"] (default: ACTIVE)
- hireDate: datetime (required)
- createdBy: string (admin userId)
- createdAt: datetime (auto-generated)
- updatedAt: datetime (auto-updated)