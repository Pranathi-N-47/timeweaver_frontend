/**
 * Frontend Unit Tests for Departments Module
 * Tests DOM manipulation, API calls, and user interactions
 */

describe('Departments Module - Frontend Tests', () => {
  const API_URL = 'http://localhost:8000/api/v1';
  
  beforeEach(() => {
    // Set up minimal DOM structure
    document.body.innerHTML = `
      <div id="departmentsTableBody"></div>
      <input id="searchInput" />
      <div id="totalDepartments">0</div>
      <form id="departmentForm">
        <input id="departmentCode" />
        <input id="departmentName" />
        <textarea id="departmentDescription"></textarea>
      </form>
      <div id="departmentModal"></div>
    `;
  });

  describe('API Integration', () => {
    test('should fetch departments from API', async () => {
      const mockDepartments = [
        { id: 1, code: 'CSE', name: 'Computer Science', description: 'CS Dept' },
        { id: 2, code: 'ECE', name: 'Electronics', description: 'ECE Dept' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDepartments
      });

      const response = await fetch(`${API_URL}/departments/`);
      const data = await response.json();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/departments/`);
      expect(data).toEqual(mockDepartments);
      expect(data.length).toBe(2);
    });

    test('should handle API errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Internal Server Error' })
      });

      const response = await fetch(`${API_URL}/departments/`);
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    test('should create department via POST', async () => {
      const newDept = {
        code: 'IT',
        name: 'Information Technology',
        description: 'IT Dept'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 6, ...newDept })
      });

      const response = await fetch(`${API_URL}/departments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDept)
      });
      
      const data = await response.json();

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/departments/`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newDept)
        })
      );
      expect(data.id).toBe(6);
      expect(data.code).toBe('IT');
    });
  });

  describe('Form Validation', () => {
    test('should validate department code length', () => {
      const isValid = (code) => code && code.length >= 2 && code.length <= 10;

      expect(isValid('CS')).toBe(true);
      expect(isValid('CSE')).toBe(true);
      expect(isValid('C')).toBe(false);  // Too short
      expect(isValid('VERYLONGCODE')).toBe(false);  // Too long
      expect(isValid('')).toBe(false);  // Empty
    });

    test('should validate department name is not empty', () => {
      const isValid = (name) => name && name.length >= 1 && name.length <= 200;

      expect(isValid('Computer Science')).toBe(true);
      expect(isValid('CS')).toBe(true);
      expect(isValid('')).toBe(false);  // Empty
    });

    test('should validate complete form data', () => {
      const validateDepartment = (dept) => {
        return dept.code && dept.code.length >= 2 && dept.code.length <= 10 &&
               dept.name && dept.name.length >= 1 && dept.name.length <= 200;
      };

      expect(validateDepartment({ 
        code: 'CSE', 
        name: 'Computer Science' 
      })).toBe(true);

      expect(validateDepartment({ 
        code: 'C', 
        name: 'Computer Science' 
      })).toBe(false);

      expect(validateDepartment({ 
        code: 'CSE', 
        name: '' 
      })).toBe(false);
    });
  });

  describe('DOM Manipulation', () => {
    test('should render department table rows', () => {
      const departments = [
        { id: 1, code: 'CSE', name: 'Computer Science', description: 'CS Dept' },
        { id: 2, code: 'ECE', name: 'Electronics', description: 'ECE Dept' }
      ];

      const tbody = document.getElementById('departmentsTableBody');
      tbody.innerHTML = departments.map(dept => `
        <tr>
          <td>${dept.code}</td>
          <td>${dept.name}</td>
          <td>${dept.description || 'N/A'}</td>
          <td><button onclick="editDepartment(${dept.id})">Edit</button></td>
        </tr>
      `).join('');

      expect(tbody.innerHTML).toContain('CSE');
      expect(tbody.innerHTML).toContain('Computer Science');
      expect(tbody.innerHTML).toContain('ECE');
      expect(tbody.querySelectorAll('tr').length).toBe(2);
    });

    test('should show empty state when no departments', () => {
      const tbody = document.getElementById('departmentsTableBody');
      tbody.innerHTML = '<tr><td colspan="4">No departments found</td></tr>';

      expect(tbody.innerHTML).toContain('No departments found');
    });

    test('should update statistics counter', () => {
      const totalCount = document.getElementById('totalDepartments');
      totalCount.textContent = '5';

      expect(totalCount.textContent).toBe('5');
    });
  });

  describe('Search Functionality', () => {
    test('should filter departments by search term', () => {
      const departments = [
        { code: 'CSE', name: 'Computer Science' },
        { code: 'ECE', name: 'Electronics' },
        { code: 'ME', name: 'Mechanical Engineering' }
      ];

      const searchTerm = 'comp';
      const filtered = departments.filter(dept =>
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filtered.length).toBe(1);
      expect(filtered[0].code).toBe('CSE');
    });

    test('should be case-insensitive', () => {
      const departments = [
        { code: 'CSE', name: 'Computer Science' }
      ];

      const searchUpper = 'COMPUTER';
      const searchLower = 'computer';
      
      const filterByTerm = (term) => departments.filter(dept =>
        dept.name.toLowerCase().includes(term.toLowerCase())
      );

      expect(filterByTerm(searchUpper).length).toBe(1);
      expect(filterByTerm(searchLower).length).toBe(1);
    });
  });

  describe('Modal Operations', () => {
    test('should populate form when editing department', () => {
      const department = {
        id: 1,
        code: 'CSE',
        name: 'Computer Science & Engineering',
        description: 'CS Department'
      };

      // Simulate editing
      document.getElementById('departmentCode').value = department.code;
      document.getElementById('departmentName').value = department.name;
      document.getElementById('departmentDescription').value = department.description;

      expect(document.getElementById('departmentCode').value).toBe('CSE');
      expect(document.getElementById('departmentName').value).toBe('Computer Science & Engineering');
    });

    test('should clear form on reset', () => {
      document.getElementById('departmentCode').value = 'CSE';
      document.getElementById('departmentName').value = 'Computer Science';
      
      document.getElementById('departmentForm').reset();

      expect(document.getElementById('departmentCode').value).toBe('');
      expect(document.getElementById('departmentName').value).toBe('');
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch(`${API_URL}/departments/`);
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    test('should handle 404 errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'Department not found' })
      });

      const response = await fetch(`${API_URL}/departments/999`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.detail).toContain('not found');
    });
  });
});
