# TimeWeaver Backend API Documentation
## Complete Frontend Integration Guide with Input Schemas

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Audit Logs](#audit-logs)
5. [Academic Entities - Complete Input Schemas](#academic-entities)
6. [Timetable Generation](#timetable-generation)
7. [Institutional Rules](#institutional-rules)
8. [Faculty Leaves](#faculty-leaves)
9. [Slot Locking](#slot-locking)
10. [Frontend Implementation Guide](#frontend-implementation-guide)

---

## Base Configuration

| Setting | Value |
|---------|-------|
| **Base URL** | `http://localhost:8000` |
| **API Version** | `/api/v1` |
| **Full Base** | `http://localhost:8000/api/v1` |
| **Swagger Docs** | `http://localhost:8000/docs` |

---

## Authentication

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | ❌ | Login with credentials |
| `GET` | `/auth/me` | ✅ | Get current user info |
| `POST` | `/auth/logout` | ✅ | Logout user |
| `POST` | `/auth/refresh` | ✅ | Refresh token |
| `POST` | `/auth/forgot-password` | ❌ | Request password reset |
| `POST` | `/auth/reset-password` | ❌ | Reset password |

### `POST /auth/login`

**Content-Type:** `application/x-www-form-urlencoded` (OAuth2 format)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | ✅ | User's username |
| `password` | string | ✅ | User's password |

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@university.edu",
    "full_name": "Admin User",
    "role": "admin",
    "is_active": true,
    "is_superuser": false,
    "faculty_id": null,
    "student_id": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-31T10:00:00Z"
  }
}
```

### `POST /auth/forgot-password`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | ✅ | Valid email format |

### `POST /auth/reset-password`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `reset_token` | string | ✅ | Token from email |
| `new_password` | string | ✅ | Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special |

---

## User Management

### Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/users/` | ✅ | Admin | Create user |
| `GET` | `/users/` | ✅ | Admin | List users |
| `GET` | `/users/{id}` | ✅ | Admin | Get user |
| `PUT` | `/users/{id}` | ✅ | Admin | Update user |
| `DELETE` | `/users/{id}` | ✅ | Admin | Deactivate user |
| `GET` | `/users/me/profile` | ✅ | Any | Get own profile |
| `PUT` | `/users/me/profile` | ✅ | Any | Update own profile |
| `PUT` | `/users/me/password` | ✅ | Any | Change password |

### `POST /users/` - Create User

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `username` | string | ✅ | 3-50 chars | `"john_doe"` |
| `email` | string | ✅ | Valid email | `"john@university.edu"` |
| `password` | string | ✅ | 8-100 chars, strength rules | `"SecureP@ss123!"` |
| `full_name` | string | ✅ | 1-100 chars | `"John Doe"` |
| `role` | enum | ❌ | `admin`, `faculty`, `student` | `"faculty"` |
| `is_active` | boolean | ❌ | Default: `true` | `true` |
| `faculty_id` | integer | ❌ | Link to faculty entity | `5` |
| `student_id` | integer | ❌ | Link to student entity | `null` |

### `PUT /users/{id}` - Update User

All fields optional:

| Field | Type | Validation |
|-------|------|------------|
| `email` | string | Valid email |
| `full_name` | string | 1-100 chars |
| `role` | enum | `admin`, `faculty`, `student` |
| `is_active` | boolean | - |
| `faculty_id` | integer | - |
| `student_id` | integer | - |

### `PUT /users/me/password` - Change Password

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `current_password` | string | ✅ | Current password |
| `new_password` | string | ✅ | 8-100 chars, strength rules |

### `GET /users/` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `skip` | integer | Pagination offset (default: 0) |
| `limit` | integer | Page size (default: 100) |
| `role` | enum | Filter: `admin`, `faculty`, `student` |
| `is_active` | boolean | Filter by active status |

---

## Audit Logs

### `GET /audit-logs/` - Query Parameters (Admin Only)

| Param | Type | Description |
|-------|------|-------------|
| `user_id` | integer | Filter by user |
| `entity_type` | string | Filter: `course`, `user`, `semester`, etc. |
| `action` | string | Filter: `create`, `update`, `delete`, `login` |
| `start_date` | datetime | ISO 8601 format |
| `end_date` | datetime | ISO 8601 format |
| `skip` | integer | Pagination offset |
| `limit` | integer | Page size (max 1000) |

---

## Academic Entities

### Semesters

#### Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| `POST` | `/semesters/` | ✅ | Admin |
| `GET` | `/semesters/` | ❌ | Any |
| `GET` | `/semesters/{id}` | ❌ | Any |
| `PUT` | `/semesters/{id}` | ✅ | Admin |
| `DELETE` | `/semesters/{id}` | ✅ | Admin |

#### `POST /semesters/` - Create Semester

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `name` | string | ✅ | 1-100 chars | `"Fall 2026"` |
| `academic_year` | string | ✅ | Pattern: `YYYY-YYYY` | `"2026-2027"` |
| `semester_type` | enum | ✅ | `ODD`, `EVEN` | `"ODD"` |
| `start_date` | date | ✅ | ISO format | `"2026-08-01"` |
| `end_date` | date | ✅ | ISO format | `"2026-12-15"` |
| `is_active` | boolean | ❌ | Default: `true` | `true` |

#### `GET /semesters/` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `skip` | integer | Pagination offset |
| `limit` | integer | Page size |
| `active_only` | boolean | Filter active semesters |

---

### Departments

#### `POST /departments/` - Create Department

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `name` | string | ✅ | 1-200 chars | `"Computer Science & Engineering"` |
| `code` | string | ✅ | 2-10 chars, unique | `"CSE"` |
| `description` | string | ❌ | - | `"Department of CS"` |

---

### Sections

#### `POST /sections/` - Create Section

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `department_id` | integer | ✅ | > 0 | `1` |
| `name` | string | ✅ | 1-50 chars | `"CSE-A"` |
| `batch_year_start` | integer | ✅ | 2020-2100 | `2023` |
| `batch_year_end` | integer | ✅ | 2020-2100 | `2027` |
| `student_count` | integer | ✅ | > 0 | `60` |
| `dedicated_room_id` | integer | ❌ | > 0, home room | `15` |
| `class_advisor_ids` | array[int] | ❌ | User IDs | `[5, 8]` |

#### `GET /sections/` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `semester_id` | integer | Filter by semester |
| `department_id` | integer | Filter by department |
| `year` | integer | Filter by year level |

---

### Courses

#### `POST /courses/` - Create Course

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `code` | string | ✅ | 2-20 chars, unique | `"CS301"` |
| `name` | string | ✅ | 1-200 chars | `"Data Structures"` |
| `theory_hours` | integer | ❌ | >= 0, default: 0 | `3` |
| `lab_hours` | integer | ❌ | >= 0, default: 0 | `2` |
| `tutorial_hours` | integer | ❌ | >= 0, default: 0 | `1` |
| `credits` | integer | ✅ | > 0 | `4` |
| `department_id` | integer | ✅ | > 0 | `1` |
| `course_category` | enum | ❌ | See below | `"CORE"` |
| `is_elective` | boolean | ❌ | DEPRECATED | `false` |
| `elective_group_id` | integer | ❌ | > 0 | `null` |
| `requires_lab` | boolean | ❌ | Default: `false` | `true` |
| `min_room_capacity` | integer | ❌ | > 0 | `60` |

**Course Categories:** `CORE`, `PROFESSIONAL_ELECTIVE`, `FREE_ELECTIVE`, `HUMANITIES`, `SCIENCE`, `LAB`

**Validation:** At least one of `theory_hours`, `lab_hours`, `tutorial_hours` must be > 0

#### `GET /courses/` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `department_id` | integer | Filter by department |
| `is_elective` | boolean | Filter electives |
| `requires_lab` | boolean | Filter by lab requirement |

---

### Elective Groups

#### `POST /elective-groups/` - Create Elective Group

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `name` | string | ✅ | 1-100 chars | `"PE1"` |
| `description` | string | ❌ | - | `"Professional Elective 1"` |
| `participating_department_ids` | array[int] | ❌ | For cross-dept | `[1, 2, 3]` |

#### `GET /elective-groups/` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `semester_id` | integer | Filter by semester |

---

### Rooms

#### `POST /rooms/` - Create Room

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `building` | string | ✅ | 1-50 chars | `"ABIII"` |
| `room_number` | string | ✅ | 1-50 chars, unique | `"C302"` |
| `full_name` | string | ✅ | 1-100 chars | `"ABIII - C302"` |
| `room_type` | enum | ✅ | See below | `"classroom"` |
| `capacity` | integer | ✅ | > 0 | `60` |
| `has_projector` | boolean | ❌ | Default: `false` | `true` |
| `has_lab_equipment` | boolean | ❌ | Default: `false` | `false` |
| `has_ac` | boolean | ❌ | Default: `false` | `true` |
| `floor` | integer | ❌ | - | `3` |
| `location_x` | float | ❌ | For mapping | `100.5` |
| `location_y` | float | ❌ | For mapping | `50.3` |

**Room Types:** `classroom`, `lab`, `auditorium`, `seminar_hall`

#### `GET /rooms/` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `room_type` | string | Filter by type |
| `has_lab_equipment` | boolean | Filter by equipment |
| `min_capacity` | integer | Minimum capacity |
| `building` | string | Filter by building |

---

### Time Slots

#### `POST /time-slots/` - Create Time Slot

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `day_of_week` | enum | ✅ | See below | `"Monday"` |
| `start_time` | time | ✅ | HH:MM:SS | `"09:00:00"` |
| `end_time` | time | ✅ | > start_time | `"10:00:00"` |
| `duration_minutes` | integer | ✅ | > 0 | `60` |
| `is_break` | boolean | ❌ | Default: `false` | `false` |
| `slot_type` | string | ❌ | Max 50 chars | `"regular"` |

**Days:** `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`

#### `GET /time-slots/` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `day_of_week` | string | Filter by day |
| `is_break` | boolean | Filter break slots |

---

### Constraints

#### `POST /constraints/` - Create Constraint

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `name` | string | ✅ | 1-200 chars | `"No faculty double booking"` |
| `constraint_type` | enum | ✅ | See below | `"NO_FACULTY_CLASH"` |
| `category` | string | ❌ | Max 50 chars | `"institutional"` |
| `rule_definition` | string | ✅ | Min 1 char | `"Faculty cannot teach two classes at same time"` |
| `priority` | integer | ❌ | 0-1000, default: 100 | `100` |
| `weight` | float | ❌ | 0.0-1.0, default: 1.0 | `1.0` |
| `is_hard` | boolean | ❌ | Default: `true` | `true` |
| `parameters` | object | ❌ | JSON config | `{"max_hours_per_day": 6}` |
| `is_active` | boolean | ❌ | Default: `true` | `true` |

**Constraint Types:**
- `NO_FACULTY_CLASH` - Faculty cannot teach two classes simultaneously
- `NO_ROOM_CLASH` - Room cannot host two classes simultaneously
- `NO_STUDENT_CLASH` - Students cannot have overlapping classes
- `WORKLOAD_LIMIT` - Maximum teaching hours per day/week
- `ROOM_CAPACITY` - Room must fit section size
- `LAB_REQUIREMENT` - Lab courses need lab rooms
- `PREFERENCE_TIME` - Preferred time slots
- `PREFERENCE_DAY` - Preferred days
- `MAX_CONSECUTIVE` - Maximum consecutive classes
- `MIN_BREAK` - Minimum break between classes
- `MAX_COMMUTE` - Maximum commute between buildings
- `ELECTIVE_NO_CLASH` - Elective courses cannot clash

#### `GET /constraints/{id}/explain` - AI Explainability ⭐

**Response:**
```json
{
  "constraint_id": 1,
  "name": "No faculty double booking",
  "constraint_type": "NO_FACULTY_CLASH",
  "is_hard": true,
  "explanation": "This constraint ensures that no faculty member is scheduled to teach two different classes at the same time.",
  "examples": [
    "Prof. Smith cannot teach CS101 and CS102 simultaneously",
    "If Prof. Jones is teaching at 10:00 AM on Monday, they cannot have another class at that time"
  ],
  "impact": "This is a hard constraint - violations will prevent timetable generation."
}
```

---

## Timetable Generation

### Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/timetables/generate` | ✅ | Admin | Generate timetable |
| `GET` | `/timetables/` | ✅ | Any | List timetables |
| `GET` | `/timetables/view` | ✅ | Any | View by section/dept |
| `GET` | `/timetables/{id}` | ✅ | Any | Get timetable |
| `GET` | `/timetables/{id}/slots` | ✅ | Any | Get slots |
| `GET` | `/timetables/{id}/conflicts` | ✅ | Any | Get conflicts |
| `DELETE` | `/timetables/{id}` | ✅ | Admin | Delete timetable |

### `POST /timetables/generate` - Generate Timetable

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `semester_id` | integer | ✅ | > 0 | `1` |
| `num_solutions` | integer | ❌ | 1-10, default: 5 | `5` |

> **Note:** The system uses optimized internal parameters for best scheduling results.

### `GET /timetables/` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `semester_id` | integer | Filter by semester |
| `status` | enum | `generating`, `completed`, `failed`, `archived` |
| `is_published` | boolean | Filter by publication status |
| `skip`, `limit` | integer | Pagination |

### `GET /timetables/view` - Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `semester_id` | integer | ✅ | Semester ID |
| `department_id` | integer | ❌ | Department filter |
| `year_level` | integer | ❌ | 1-4 |
| `section_name` | string | ❌ | e.g., "A", "B" |

### `GET /timetables/{id}/slots` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `section_id` | integer | Filter by section |
| `day_of_week` | integer | 0-6 (Mon-Sun) |

### `GET /timetables/{id}/conflicts` - Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `severity` | enum | `HIGH`, `MEDIUM`, `LOW` |
| `is_resolved` | boolean | Filter by resolution |

---

## Institutional Rules

### Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| `POST` | `/rules/` | ✅ | Admin |
| `GET` | `/rules/` | ✅ | Any |
| `GET` | `/rules/{id}` | ✅ | Any |
| `PUT` | `/rules/{id}` | ✅ | Admin |
| `DELETE` | `/rules/{id}` | ✅ | Admin |
| `PATCH` | `/rules/{id}/toggle` | ✅ | Admin |

### `POST /rules/` - Create Rule

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `name` | string | ✅ | 1-200 chars | `"No Early Morning Classes"` |
| `description` | string | ❌ | - | `"No classes before 9 AM"` |
| `rule_type` | enum | ✅ | See below | `"TIME_WINDOW"` |
| `configuration` | object | ✅ | Type-specific | See examples |
| `is_hard_constraint` | boolean | ❌ | Default: `true` | `true` |
| `weight` | float | ❌ | 0.0-1.0 | `1.0` |
| `applies_to_departments` | array[int] | ❌ | Empty = all | `[1, 2]` |
| `applies_to_years` | array[int] | ❌ | 1-4, empty = all | `[3, 4]` |
| `is_active` | boolean | ❌ | Default: `true` | `true` |

**Rule Types & Configuration:**

```javascript
// TIME_WINDOW - Restrict scheduling to time range
{
  "rule_type": "TIME_WINDOW",
  "configuration": { "min_slot": 2, "max_slot": 8 }
}

// SLOT_BLACKOUT - Block specific time slots
{
  "rule_type": "SLOT_BLACKOUT",
  "configuration": { "blackout_slots": [1, 2, 12, 13] }
}

// MAX_CONSECUTIVE - Limit consecutive classes
{
  "rule_type": "MAX_CONSECUTIVE",
  "configuration": { "max_consecutive_classes": 3 }
}

// DAY_BLACKOUT - Block entire days
{
  "rule_type": "DAY_BLACKOUT",
  "configuration": { "blackout_days": [5, 6] }  // 0=Mon, 6=Sun
}
```

---

## Faculty Leaves

### Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| `POST` | `/faculty-leaves/analyze` | ✅ | Faculty/Admin |
| `POST` | `/faculty-leaves/` | ✅ | Faculty/Admin |
| `GET` | `/faculty-leaves/` | ✅ | Faculty/Admin |
| `GET` | `/faculty-leaves/{id}` | ✅ | Faculty/Admin |
| `PATCH` | `/faculty-leaves/{id}/approve` | ✅ | Admin |
| `PATCH` | `/faculty-leaves/{id}/apply` | ✅ | Admin |

### `POST /faculty-leaves/analyze` - Analyze Impact

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `faculty_id` | integer | ✅ | > 0 | `10` |
| `timetable_id` | integer | ✅ | > 0 | `5` |
| `start_date` | date | ✅ | ISO format | `"2024-10-01"` |
| `end_date` | date | ✅ | >= start_date | `"2024-10-07"` |
| `leave_type` | enum | ✅ | See below | `"SICK"` |
| `strategy` | enum | ❌ | Default: `WITHIN_SECTION_SWAP` | `"WITHIN_SECTION_SWAP"` |

**Leave Types:** `SICK`, `CASUAL`, `VACATION`, `CONFERENCE`, `OTHER`

**Strategies:** 
- `WITHIN_SECTION_SWAP` - Swap with faculty in same section
- `CROSS_SECTION_SWAP` - Swap across sections
- `CANCEL_CLASS` - Cancel affected classes
- `RESCHEDULE` - Reschedule to different slot

### `POST /faculty-leaves/` - Create Leave

All fields from analyze, plus:

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `semester_id` | integer | ✅ | `1` |
| `reason` | string | ❌ | `"Medical emergency"` |
| `replacement_faculty_id` | integer | ❌ | `15` |

---

## Slot Locking

### Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| `POST` | `/slot-locks/lock` | ✅ | Admin |
| `POST` | `/slot-locks/unlock` | ✅ | Admin |
| `GET` | `/slot-locks/locked` | ✅ | Any |

### `POST /slot-locks/lock` - Lock Slots

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `timetable_id` | integer | ✅ | > 0 | `5` |
| `slot_ids` | array[int] | ✅ | Min 1 item | `[1, 2, 3, 4]` |

### `GET /slot-locks/locked` - Query Parameters

| Param | Type | Required |
|-------|------|----------|
| `timetable_id` | integer | ✅ |

---

## Frontend Implementation Guide

### Role-Based Access

| Feature | Admin | Faculty | Student |
|---------|-------|---------|---------|
| User Management | ✅ | ❌ | ❌ |
| Academic Entity CRUD | ✅ | ❌ | ❌ |
| Timetable Generation | ✅ | ❌ | ❌ |
| View Timetables | ✅ | ✅ | ✅ |
| Faculty Leave (own) | ✅ | ✅ | ❌ |
| Approve Leave | ✅ | ❌ | ❌ |
| Audit Logs | ✅ | ❌ | ❌ |

### Suggested Page Structure

```
/login                    → Login page
/dashboard                → Role-specific dashboard

# Admin Pages
/admin/users              → User management
/admin/semesters          → Semester management
/admin/departments        → Department management
/admin/sections           → Section management
/admin/courses            → Course management
/admin/elective-groups    → Elective groups
/admin/rooms              → Room management
/admin/time-slots         → Time slot management
/admin/constraints        → Constraint management
/admin/rules              → Institutional rules
/admin/timetables         → Timetable generation
/admin/audit-logs         → Audit log viewer

# All Users
/timetable                → View timetable
/profile                  → User profile
/leave                    → Faculty leave (faculty only)
```

### Error Handling

```javascript
const handleApiError = (response) => {
  switch (response.status) {
    case 400: return "Validation error - check input fields";
    case 401: return "Session expired - please login again";
    case 403: return "Access denied";
    case 404: return "Resource not found";
    case 500: return "Server error - please try again";
  }
};
```

---

## Summary

| Category | Endpoints |
|----------|-----------|
| Authentication | 6 |
| Users | 8 |
| Audit Logs | 2 |
| Semesters | 5 |
| Departments | 5 |
| Sections | 5 |
| Courses | 5 |
| Elective Groups | 5 |
| Rooms | 5 |
| Time Slots | 5 |
| Constraints | 6 |
| Timetables | 7 |
| Institutional Rules | 6 |
| Faculty Leaves | 6 |
| Slot Locks | 3 |
| **Total** | **79** |
