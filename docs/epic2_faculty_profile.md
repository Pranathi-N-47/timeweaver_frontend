# Epic 2: Faculty Profile, Availability & Preference

Owner: Meka Jahnavi
Module: Module 4 — Faculty Management & Workload

Overview
--------
Epic 2 covers faculty profile management, availability/preferences, workload caps and substitution support. This document lays out the user stories, acceptance criteria, implementation plan, design details (data models, API, UI), and testing plans for the high-priority user stories: 2.1, 2.2 and 2.6.

User Stories (High Priority)
---------------------------

2.1 As a faculty member, I want to set my preferred time slots so that my schedule suits my productivity.

- Acceptance Criteria
  - Faculty can mark any time slot as `preferred` or `not_available` via a weekly grid UI.
  - Preferences are persisted in the backend and returned by an API.
  - Preferences influence the timetable optimizer (weights / soft constraints).
  - Faculty can list, update and delete their preferences.

- Plan (Implementation tasks)
  1. Frontend: Implement `Preferences.jsx` weekly grid UI and interactions (already scaffolded).
  2. Backend: Add persistence (`FacultyPreference` model already created) and API endpoints: `POST /faculty-preferences`, `GET /faculty-preferences`, `PUT /faculty-preferences/{id}`, `DELETE /faculty-preferences/{id}` (routes created).
  3. Backend: Implement preference weighting module that converts preferences into optimizer weights.
  4. Integration: Add preference weights to timetable generation fitness function (Module 3 integration).

- Design
  - Data model: `FacultyPreference` (fields: `id`, `faculty_id`, `day_of_week`, `time_slot_id`, `preference_type`).
  - Preference semantics:
    - `preferred` = +W_pref (positive fitness for allocating that slot)
    - `not_available` = -INF (hard disallow) or large negative weight if soft
  - API contract (examples):

    POST /api/v1/faculty-preferences?faculty_id=1
    {
      "day_of_week": 0,
      "time_slot_id": 3,
      "preference_type": "not_available"
    }

    GET /api/v1/faculty-preferences?faculty_id=1 -> [ ... ]

- Weighting approach (backend / optimizer)
  - Convert preferences into numeric penalties/bonuses used by the generator:
    - preferred -> +1.0 (configurable)
    - not_available -> -9999 (treat as hard constraint) or -10 (soft)
  - Provide a `PreferenceWeightProvider` service that returns a map: (faculty_id, day, time_slot) -> weight.
  - Expose configuration toggles: `PREFERENCE_SOFT=true/false`, `PREF_WEIGHT=1.0`, `NOT_AVAILABLE_WEIGHT=-9999`.

- Testing
  - Unit: Pydantic schema validation for preference input (done in `app/schemas/faculty.py`).
  - Unit: API tests for preference CRUD (happy & validation paths).
  - Integration: Preference satisfaction tests — generate a timetable with mocked preferences and assert fraction of `preferred` slots satisfied increases when optimizer uses weights.
  - Edge cases: Overlapping preferences, duplicate preference entries, daylight-savings / time-zone consistency.


2.2 As an administrator, I want to set maximum teaching hours for faculty so that workload limits are followed.

- Acceptance Criteria
  - Admin can set/modify `max_hours_per_week` on faculty profile via API and admin UI.
  - The workload calculator reports when a faculty is overloaded.
  - Timetable generator considers `max_hours_per_week` as a constraint (hard or soft depending on policy) and avoids assignments that cause overload where possible.

- Plan (Implementation tasks)
  1. Backend: Ensure `Faculty.max_hours_per_week` exists (done) and provide endpoint to update it (covered by `PUT /faculty/{id}`).
  2. Frontend: Add a Policy/Faculty-edit UI in `Admin -> FacultyList` and a dedicated Policy configuration screen if required.
  3. Backend: Encode workload caps in generator — prefer soft-first approach: try to avoid overload; if unavoidable, produce reports of overload.

- Design
  - Model: `Faculty.max_hours_per_week` (integer)
  - API: `PUT /api/v1/faculty/{id}` accepts `max_hours_per_week`.
  - Generator integration:
    - During assignment, maintain per-faculty `assigned_hours` and a constraint check.
    - Two modes:
      - Strict: block any assignment exceeding cap.
      - Soft: apply penalty proportional to (assigned_hours - max_hours) * OVERLOAD_PENALTY.
    - Configuration flags: `WORKLOAD_CAP_MODE=strict|soft`, `OVERLOAD_PENALTY=10.0`.

- Testing
  - Unit: `WorkloadCalculator.calculate_workload` tests already added.
  - Integration: Overload prevention tests — generator should avoid creating timetables with faculty whose assignments exceed their caps when strict mode is on.
  - Edge-case tests: Faculty with `max_hours_per_week=0`, fractional hours, simultaneous additions.


2.6 As an administrator, I want to assign substitute teachers so that classes continue smoothly.

- Acceptance Criteria
  - Admin can request a substitute for a given section/slot.
  - System ranks eligible faculty based on availability, current workload, and suitability (department, expertise).
  - UI displays top recommendations with short rationale and allows admin to assign or request substitutes.

- Plan (Implementation tasks)
  1. Backend: Implement `substitute_recommender` service that returns ranked candidates.
  2. Backend: Add API `GET /substitutes?section_id=...&slot_id=...` and `POST /substitutes/assign`.
  3. Frontend: Add a Suggestion panel in Admin UI (e.g., on Section detail) that calls recommender and displays top-N candidates.

- Design
  - Inputs for recommender:
    - `slot` (day, time_slot_id, room_id, required_faculty_skills)
    - `exclude_list` (unavailable / currently assigned faculty)
  - Features considered in ranking:
    - Availability (no `not_available` preference at that slot)
    - Current utilization (prefer less-utilized faculty)
    - Department / expertise match score
    - Recent substitution load (avoid repeated substitution assignments)
  - Scoring function (example):

    score = 100
      + 50 * expertise_match
      - 2 * utilization_percent
      + 0 if available else -1000
      - 10 * recent_sub_count

  - API example:

    GET /api/v1/substitutes?day=2&time_slot_id=3&department_id=1
    -> [{candidate_id: 12, score: 82.5, reason: "Available, low load, same dept"}, ...]

- Testing
  - Unit: Recommender ranking correctness with synthetic data.
  - Integration: End-to-end substitute request flow (request -> recommended -> admin assigns -> DB updates).
  - Evaluation: Recommendation accuracy tests (historic data simulation) and workload balance tests verifying assignment didn't overload candidate.


Cross-cutting Concerns
----------------------

- RBAC
  - Faculty endpoints should allow the faculty to manage only their own preferences unless the caller is admin.
  - Admin endpoints require admin privileges.

- Configurable Policies
  - All important numeric values and modes should be configurable via environment variables or a `core/config.py` file:
    - `PREFERENCE_SOFT` (bool)
    - `PREF_WEIGHT` (float)
    - `NOT_AVAILABLE_WEIGHT` (float)
    - `WORKLOAD_CAP_MODE` (strict|soft)
    - `OVERLOAD_PENALTY` (float)

- Observability
  - Log preference changes, workload alerts, substitute assignments to `audit_logs` middleware.
  - Provide metrics for preference satisfaction rate and overload incidents.

Deliverables & Acceptance Checklist
----------------------------------

- [ ] Frontend: `Preferences.jsx` working weekly grid with save/load/delete.
- [ ] Backend: Preference CRUD endpoints (done).
- [ ] Backend: `PreferenceWeightProvider` service for optimizer inputs.
- [ ] Backend: `WorkloadCap` enforcement in generator (configurable strict/soft). 
- [ ] Backend: `SubstituteRecommender` API + assign endpoint.
- [ ] Tests: Preference satisfaction tests (integration), overload prevention tests, recommender unit tests.
- [ ] Docs: This Epic 2 specification saved in `docs/epic2_faculty_profile.md` and referenced in `MODULE_SPECIFICATIONS.md`.

Implementation Notes & Quick Snippets
-----------------------------------

1) Preference weight provider (sketch - backend):

```python
# app/services/preference_weighting.py
class PreferenceWeightProvider:
    def __init__(self, db, soft=True, pref_weight=1.0, not_avail_weight=-9999):
        self.db = db
        self.soft = soft
        self.pref_weight = pref_weight
        self.not_avail_weight = not_avail_weight

    async def build_weights(self, semester_id):
        # returns {(faculty_id, day, slot_id): weight}
        # query FacultyPreference and build map
        pass
```

2) Substitute recommender sketch:

```python
# app/services/substitute_recommender.py
class SubstituteRecommender:
    def __init__(self, db):
        self.db = db

    async def rank_candidates(self, day, time_slot_id, department_id, exclude_ids=None, top_n=5):
        # 1. Load eligible faculty in dept
        # 2. Filter by preference availability
        # 3. Compute score = expertise + availability - utilization
        # 4. Return sorted list
        pass
```

3) Example API route for substitutes:

```
GET /api/v1/substitutes?day=2&time_slot_id=3&department_id=1
POST /api/v1/substitutes/assign
{ "section_id": 10, "slot_id": 5, "substitute_id": 12 }
```

Testing Plan Summary (concrete commands)
---------------------------------------

Backend (pytest):

```bash
cd C:\Users\mekaj\OneDrive\Desktop\timeweaver_backend
# Activate venv first: .\venv\Scripts\activate
pytest tests/test_workload.py::test_calculate_workload_normal -q
pytest tests/test_faculty.py -q
```

Frontend (Jest):

```bash
cd C:\Users\mekaj\OneDrive\Desktop\timeweaver_frontend
npm test -- --watchAll=false
```

What's Next / Suggested Sequence
-------------------------------
1. Review and confirm the design and scoring formulas in this doc.
2. Implement `PreferenceWeightProvider` (backend) and add unit tests.
3. Wire preference weights into the timetable generator (Module 3 integration).
4. Implement `SubstituteRecommender` with a simple rule-based scorer, then iterate.
5. Add admin UI controls for workload caps and substitute assignment.


---

Last updated: 2026-02-07
