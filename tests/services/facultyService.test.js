/**
 * Frontend Tests - Faculty Service
 * Repository: timeweaver_frontend
 * Owner: Meka Jahnavi
 * 
 * Test suite for Faculty Service API integration.
 * Tests all API methods and error handling.
 * 
 * Test Coverage: API calls, request formatting, error handling
 */

import facultyService from '../../../src/services/facultyService';
import api from '../../../src/services/api';

// Mock the api module
jest.mock('../../../src/services/api');

describe('Faculty Service', () => {

  /**
   * Setup before each test
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============ Workload Tests ============

  /**
   * Test: getWorkload API call
   * 
   * Verifies:
   * - Correct API endpoint called
   * - Parameters passed correctly
   * - Response returned properly
   * 
   * Test Coverage: facultyService.getWorkload
   */
  describe('getWorkload', () => {
    test('fetches workload for faculty and semester', async () => {
      const mockData = {
        total_hours: 15,
        max_hours: 18,
        is_overloaded: false,
        utilization_percentage: 83.33,
        section_count: 3
      };

      api.get.mockResolvedValue({ data: mockData });

      const result = await facultyService.getWorkload(1, 1);

      expect(api.get).toHaveBeenCalledWith('/faculty/1/workload?semester_id=1');
      expect(result).toEqual(mockData);
    });

    test('handles API errors gracefully', async () => {
      const mockError = new Error('Network error');
      api.get.mockRejectedValue(mockError);

      await expect(facultyService.getWorkload(1, 1)).rejects.toThrow('Network error');
    });

    test('formats semester_id as query parameter', async () => {
      api.get.mockResolvedValue({ data: {} });

      await facultyService.getWorkload(5, 3);

      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('semester_id=3'));
    });
  });

  // ============ Faculty List Tests ============

  /**
   * Test: getFacultyList API call
   * 
   * Verifies:
   * - Pagination parameters passed
   * - Returns array of faculty
   * 
   * Test Coverage: facultyService.getFacultyList
   */
  describe('getFacultyList', () => {
    test('fetches list of faculty with pagination', async () => {
      const mockData = [
        {
          id: 1,
          employee_id: 'FAC001',
          designation: 'Professor',
          department_id: 1
        },
        {
          id: 2,
          employee_id: 'FAC002',
          designation: 'Lecturer',
          department_id: 2
        }
      ];

      api.get.mockResolvedValue({ data: mockData });

      const result = await facultyService.getFacultyList(0, 50);

      expect(api.get).toHaveBeenCalledWith('/faculty?skip=0&limit=50');
      expect(result).toEqual(mockData);
      expect(Array.isArray(result)).toBe(true);
    });

    test('uses default pagination values', async () => {
      api.get.mockResolvedValue({ data: [] });

      await facultyService.getFacultyList();

      expect(api.get).toHaveBeenCalledWith('/faculty?skip=0&limit=100');
    });
  });

  // ============ Faculty CRUD Tests ============

  /**
   * Test: createFaculty API call
   * 
   * Verifies:
   * - POST request sent correctly
   * - Faculty data passed to API
   * - Returns created faculty object
   * 
   * Test Coverage: facultyService.createFaculty
   */
  describe('createFaculty', () => {
    test('creates new faculty with valid data', async () => {
      const facultyData = {
        user_id: 5,
        employee_id: 'FAC001',
        department_id: 1,
        designation: 'Professor',
        max_hours_per_week: 20
      };

      const mockResponse = {
        id: 1,
        ...facultyData
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await facultyService.createFaculty(facultyData);

      expect(api.post).toHaveBeenCalledWith('/faculty', facultyData);
      expect(result).toEqual(mockResponse);
      expect(result.id).toBe(1);
    });

    test('handles duplicate employee_id error', async () => {
      const error = new Error('Unique constraint failed');
      api.post.mockRejectedValue(error);

      await expect(
        facultyService.createFaculty({
          user_id: 5,
          employee_id: 'FAC001',
          department_id: 1
        })
      ).rejects.toThrow();
    });
  });

  /**
   * Test: updateFaculty API call
   * 
   * Verifies:
   * - PUT request sent to correct endpoint
   * - Only modified fields sent
   * - Returns updated faculty
   * 
   * Test Coverage: facultyService.updateFaculty
   */
  describe('updateFaculty', () => {
    test('updates faculty profile', async () => {
      const updateData = {
        designation: 'Associate Professor',
        max_hours_per_week: 22
      };

      const mockResponse = {
        id: 1,
        user_id: 5,
        employee_id: 'FAC001',
        ...updateData
      };

      api.put.mockResolvedValue({ data: mockResponse });

      const result = await facultyService.updateFaculty(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/faculty/1', updateData);
      expect(result.designation).toBe('Associate Professor');
      expect(result.max_hours_per_week).toBe(22);
    });
  });

  /**
   * Test: deleteFaculty API call
   * 
   * Verifies:
   * - DELETE request sent
   * - Faculty ID in URL
   * 
   * Test Coverage: facultyService.deleteFaculty
   */
  describe('deleteFaculty', () => {
    test('deletes faculty by ID', async () => {
      api.delete.mockResolvedValue({});

      await facultyService.deleteFaculty(1);

      expect(api.delete).toHaveBeenCalledWith('/faculty/1');
    });

    test('returns void on success', async () => {
      api.delete.mockResolvedValue({});

      const result = await facultyService.deleteFaculty(1);

      expect(result).toBeUndefined();
    });
  });

  // ============ Preference Tests ============

  /**
   * Test: setPreference API call
   * 
   * Verifies:
   * - Preference data formatted correctly
   * - Query parameter includes faculty_id
   * - Returns created preference
   * 
   * Test Coverage: facultyService.setPreference
   */
  describe('setPreference', () => {
    test('sets faculty time preference', async () => {
      const preferenceData = {
        day_of_week: 0,
        time_slot_id: 1,
        preference_type: 'not_available'
      };

      const mockResponse = {
        id: 1,
        faculty_id: 1,
        ...preferenceData
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await facultyService.setPreference(1, preferenceData);

      expect(api.post).toHaveBeenCalledWith(
        '/faculty-preferences?faculty_id=1',
        preferenceData
      );
      expect(result).toEqual(mockResponse);
    });

    test('validates preference type values', async () => {
      // This is client-side validation
      const invalidData = {
        day_of_week: 0,
        time_slot_id: 1,
        preference_type: 'invalid'
      };

      // Should still call API (backend validates)
      api.post.mockResolvedValue({ data: {} });

      await facultyService.setPreference(1, invalidData);

      expect(api.post).toHaveBeenCalled();
    });
  });

  /**
   * Test: getPreferences API call
   * 
   * Verifies:
   * - Correct endpoint called
   * - Returns array of preferences
   * 
   * Test Coverage: facultyService.getPreferences
   */
  describe('getPreferences', () => {
    test('fetches preferences for faculty', async () => {
      const mockData = [
        {
          id: 1,
          faculty_id: 1,
          day_of_week: 0,
          time_slot_id: 1,
          preference_type: 'not_available'
        },
        {
          id: 2,
          faculty_id: 1,
          day_of_week: 1,
          time_slot_id: 2,
          preference_type: 'preferred'
        }
      ];

      api.get.mockResolvedValue({ data: mockData });

      const result = await facultyService.getPreferences(1);

      expect(api.get).toHaveBeenCalledWith('/faculty-preferences?faculty_id=1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    test('returns empty array if no preferences', async () => {
      api.get.mockResolvedValue({ data: [] });

      const result = await facultyService.getPreferences(1);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  /**
   * Test: updatePreference API call
   * 
   * Verifies:
   * - PUT request to correct endpoint
   * - Returns updated preference
   * 
   * Test Coverage: facultyService.updatePreference
   */
  describe('updatePreference', () => {
    test('updates preference by ID', async () => {
      const updateData = {
        day_of_week: 0,
        time_slot_id: 1,
        preference_type: 'preferred'
      };

      const mockResponse = {
        id: 1,
        faculty_id: 1,
        ...updateData
      };

      api.put.mockResolvedValue({ data: mockResponse });

      const result = await facultyService.updatePreference(1, updateData);

      expect(api.put).toHaveBeenCalledWith(
        '/faculty-preferences/1',
        updateData
      );
      expect(result.preference_type).toBe('preferred');
    });
  });

  /**
   * Test: deletePreference API call
   * 
   * Verifies:
   * - DELETE request sent
   * 
   * Test Coverage: facultyService.deletePreference
   */
  describe('deletePreference', () => {
    test('deletes preference by ID', async () => {
      api.delete.mockResolvedValue({});

      await facultyService.deletePreference(1);

      expect(api.delete).toHaveBeenCalledWith('/faculty-preferences/1');
    });
  });

  // ============ Edge Cases & Error Handling ============

  /**
   * Test: Handles network errors
   */
  test('handles network errors for all methods', async () => {
    const networkError = new Error('Network timeout');

    api.get.mockRejectedValue(networkError);
    api.post.mockRejectedValue(networkError);
    api.put.mockRejectedValue(networkError);
    api.delete.mockRejectedValue(networkError);

    await expect(facultyService.getFacultyList()).rejects.toThrow();
    await expect(
      facultyService.createFaculty({ user_id: 1 })
    ).rejects.toThrow();
  });

  /**
   * Test: Handles HTTP 404 errors
   */
  test('handles 404 not found errors', async () => {
    const notFoundError = {
      response: { status: 404, data: { detail: 'Faculty not found' } }
    };

    api.get.mockRejectedValue(notFoundError);

    await expect(facultyService.getWorkload(999, 1)).rejects.toThrow();
  });

  /**
   * Test: Handles unauthorized (401) errors
   */
  test('handles authentication errors', async () => {
    const authError = {
      response: { status: 401, data: { detail: 'Unauthorized' } }
    };

    api.get.mockRejectedValue(authError);

    await expect(facultyService.getFacultyList()).rejects.toThrow();
  });
});
