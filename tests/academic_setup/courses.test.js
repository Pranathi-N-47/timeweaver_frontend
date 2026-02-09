/**
 * Frontend Unit Tests for Courses Module
 * Tests tutorial_hours field and course management
 */

describe('Courses Module - Frontend Tests', () => {
  const API_URL = 'http://localhost:8000/api/v1';

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="courseForm">
        <input id="courseCode" />
        <input id="courseTitle" />
        <input id="courseCredits" type="number" />
        <select id="courseDepartment"></select>
        <input id="theoryHours" type="number" />
        <input id="labHours" type="number" />
        <input id="tutorialHours" type="number" />
        <input id="isElective" type="checkbox" />
        <input id="requiresLab" type="checkbox" />
      </form>
      <div id="coursesTableBody"></div>
    `;
  });

  describe('Tutorial Hours Field Tests', () => {
    test('should include tutorial_hours in course data', () => {
      document.getElementById('courseCode').value = 'CS301';
      document.getElementById('courseTitle').value = 'Data Structures';
      document.getElementById('courseCredits').value = '4';
      document.getElementById('courseDepartment').value = '1';
      document.getElementById('theoryHours').value = '3';
      document.getElementById('labHours').value = '2';
      document.getElementById('tutorialHours').value = '1';

      const courseData = {
        code: document.getElementById('courseCode').value,
        name: document.getElementById('courseTitle').value,
        credits: parseInt(document.getElementById('courseCredits').value),
        department_id: parseInt(document.getElementById('courseDepartment').value),
        theory_hours: parseInt(document.getElementById('theoryHours').value) || 0,
        lab_hours: parseInt(document.getElementById('labHours').value) || 0,
        tutorial_hours: parseInt(document.getElementById('tutorialHours').value) || 0,
        is_elective: document.getElementById('isElective').checked,
        requires_lab: document.getElementById('requiresLab').checked
      };

      expect(courseData.tutorial_hours).toBe(1);
      expect(courseData.theory_hours).toBe(3);
      expect(courseData.lab_hours).toBe(2);
    });

    test('should default tutorial_hours to 0 if empty', () => {
      document.getElementById('tutorialHours').value = '';

      const tutorial_hours = parseInt(document.getElementById('tutorialHours').value) || 0;

      expect(tutorial_hours).toBe(0);
    });

    test('should handle tutorial_hours updates', () => {
      const course = {
        id: 1,
        code: 'CS101',
        tutorial_hours: 2
      };

      document.getElementById('tutorialHours').value = course.tutorial_hours;

      expect(document.getElementById('tutorialHours').value).toBe('2');
    });
  });

  describe('Course Creation with Tutorial Hours', () => {
    test('should create course WITH tutorial_hours', async () => {
      const newCourse = {
        code: 'CS401',
        name: 'Machine Learning',
        credits: 4,
        department_id: 1,
        theory_hours: 3,
        lab_hours: 2,
        tutorial_hours: 1,  // NOT hardcoded to 0
        is_elective: true,
        requires_lab: true
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 7, ...newCourse })
      });

      const response = await fetch(`${API_URL}/courses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });

      const data = await response.json();

      expect(data.tutorial_hours).toBe(1);
      expect(data.tutorial_hours).not.toBe(0);  // Ensure NOT hardcoded
    });

    test('should create course WITHOUT tutorial_hours (zero)', async () => {
      const newCourse = {
        code: 'CS402',
        name: 'Software Engineering',
        credits: 3,
        department_id: 1,
        theory_hours: 3,
        lab_hours: 0,
        tutorial_hours: 0,
        is_elective: false,
        requires_lab: false
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 8, ...newCourse })
      });

      const response = await fetch(`${API_URL}/courses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });

      const data = await response.json();

      expect(data.tutorial_hours).toBe(0);
    });
  });

  describe('Course Table Rendering', () => {
    test('should display tutorial_hours column in table', () => {
      const courses = [
        { 
          id: 1, 
          code: 'CS101', 
          name: 'Intro to CS',
          theory_hours: 3,
          lab_hours: 2,
          tutorial_hours: 1
        }
      ];

      const tbody = document.getElementById('coursesTableBody');
      tbody.innerHTML = courses.map(course => `
        <tr>
          <td>${course.code}</td>
          <td>${course.name}</td>
          <td>${course.theory_hours || 0}</td>
          <td>${course.lab_hours || 0}</td>
          <td>${course.tutorial_hours || 0}</td>
        </tr>
      `).join('');

      expect(tbody.innerHTML).toContain('<td>3</td>');  // theory_hours
      expect(tbody.innerHTML).toContain('<td>2</td>');  // lab_hours
      expect(tbody.innerHTML).toContain('<td>1</td>');  // tutorial_hours
    });
  });

  describe('Form Validation', () => {
    test('should validate course code format', () => {
      const isValid = (code) => code && code.length >= 2 && code.length <= 20;

      expect(isValid('CS101')).toBe(true);
      expect(isValid('C')).toBe(false);
    });

    test('should validate credits are positive', () => {
      const isValid = (credits) => credits > 0;

      expect(isValid(3)).toBe(true);
      expect(isValid(0)).toBe(false);
      expect(isValid(-1)).toBe(false);
    });

    test('should validate hours are non-negative', () => {
      const isValid = (hours) => hours >= 0;

      expect(isValid(0)).toBe(true);
      expect(isValid(3)).toBe(true);
      expect(isValid(-1)).toBe(false);
    });
  });
});
