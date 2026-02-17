/**
 * Faculty Service - API Integration Layer
 * Repository: timeweaver_frontend
 * Owner: Meka Jahnavi
 * 
 * Handles all faculty-related API calls and data management.
 * Provides methods for faculty CRUD, workload retrieval, and preference management.
 * 
 * Dependencies:
 *   - services/api.js (axios instance)
 * 
 * @module facultyService
 */

import api from './api';

/**
 * Faculty Service Object
 * All methods return promises with API responses
 */
export const facultyService = {
  /**
   * Get workload for a specific faculty member
   * 
   * @async
   * @param {number} facultyId - Faculty ID
   * @param {number} semesterId - Semester ID
   * @returns {Promise<Object>} Workload data with hours and utilization
   * @throws {Error} If API call fails
   * 
   * @example
   * const workload = await facultyService.getWorkload(1, 1);
   * console.log(workload.is_overloaded); // true/false
   */
  getWorkload: async (facultyId, semesterId) => {
    const response = await api.get(
      `/faculty/${facultyId}/workload?semester_id=${semesterId}`
    );
    return response.data;
  },

  /**
   * Get current user's workload
   * Convenience method that gets current user's faculty ID first
   * 
   * @async
   * @param {number} semesterId - Semester ID
   * @returns {Promise<Object>} Workload data
   */
  getMyWorkload: async (semesterId) => {
    try {
      // Would need to get current user from auth service
      const response = await api.get(`/faculty/me/workload?semester_id=${semesterId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workload:', error);
      throw error;
    }
  },

  /**
   * Get all faculty (admin only)
   * 
   * @async
   * @param {number} [skip=0] - Number of records to skip (pagination)
   * @param {number} [limit=100] - Maximum records to return
   * @returns {Promise<Array>} List of faculty
   * @throws {Error} If not authorized or API fails
   * 
   * @example
   * const faculty = await facultyService.getFacultyList(0, 50);
   */
  getFacultyList: async (skip = 0, limit = 100) => {
    const response = await api.get(
      `/faculty?skip=${skip}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get details for specific faculty
   * 
   * @async
   * @param {number} facultyId - Faculty ID
   * @returns {Promise<Object>} Faculty details with preferences
   * @throws {Error} If faculty not found
   */
  getFacultyDetail: async (facultyId) => {
    const response = await api.get(`/faculty/${facultyId}`);
    return response.data;
  },

  /**
   * Create new faculty profile (admin only)
   * 
   * @async
   * @param {Object} facultyData - Faculty data
   * @param {number} facultyData.user_id - User ID
   * @param {string} facultyData.employee_id - Employee ID
   * @param {number} facultyData.department_id - Department ID
   * @param {string} [facultyData.designation="Lecturer"] - Faculty designation
   * @param {number} [facultyData.max_hours_per_week=18] - Max hours per week
   * @returns {Promise<Object>} Created faculty
   * @throws {Error} If validation fails or already exists
   * 
   * @example
   * const newFaculty = await facultyService.createFaculty({
   *   user_id: 5,
   *   employee_id: 'FAC001',
   *   department_id: 1,
   *   designation: 'Professor',
   *   max_hours_per_week: 20
   * });
   */
  createFaculty: async (facultyData) => {
    const response = await api.post('/faculty', facultyData);
    return response.data;
  },

  /**
   * Update faculty profile (admin only)
   * 
   * @async
   * @param {number} facultyId - Faculty ID
   * @param {Object} updateData - Fields to update
   * @param {string} [updateData.designation] - New designation
   * @param {number} [updateData.max_hours_per_week] - New max hours
   * @param {number} [updateData.department_id] - New department
   * @returns {Promise<Object>} Updated faculty
   * @throws {Error} If not found or not authorized
   */
  updateFaculty: async (facultyId, updateData) => {
    const response = await api.put(`/faculty/${facultyId}`, updateData);
    return response.data;
  },

  /**
   * Delete faculty profile (admin only)
   * Cascades delete to preferences and assignments
   * 
   * @async
   * @param {number} facultyId - Faculty ID
   * @returns {Promise<void>}
   * @throws {Error} If not found or not authorized
   */
  deleteFaculty: async (facultyId) => {
    await api.delete(`/faculty/${facultyId}`);
  },

  // ============ PREFERENCES ============

  /**
   * Set or update faculty time preference
   * 
   * @async
   * @param {number} facultyId - Faculty ID
   * @param {Object} preferenceData - Preference data
   * @param {number} preferenceData.day_of_week - Day (0=Monday, 6=Sunday)
   * @param {number} preferenceData.time_slot_id - Time slot ID
   * @param {string} preferenceData.preference_type - "preferred" or "not_available"
   * @returns {Promise<Object>} Created/updated preference
   * @throws {Error} If validation fails
   * 
   * @example
   * const pref = await facultyService.setPreference(1, {
   *   day_of_week: 0,
   *   time_slot_id: 1,
   *   preference_type: 'not_available'
   * });
   */
  setPreference: async (facultyId, preferenceData) => {
    const response = await api.post(
      `/faculty-preferences?faculty_id=${facultyId}`,
      preferenceData
    );
    return response.data;
  },

  /**
   * Get all preferences for a faculty
   * 
   * @async
   * @param {number} facultyId - Faculty ID
   * @returns {Promise<Array>} List of preferences
   * 
   * @example
   * const prefs = await facultyService.getPreferences(1);
   * prefs.forEach(p => console.log(p.preference_type));
   */
  getPreferences: async (facultyId) => {
    const response = await api.get(
      `/faculty-preferences?faculty_id=${facultyId}`
    );
    return response.data;
  },

  /**
   * Update a specific preference
   * 
   * @async
   * @param {number} preferenceId - Preference ID
   * @param {Object} updateData - Updated preference data
   * @returns {Promise<Object>} Updated preference
   */
  updatePreference: async (preferenceId, updateData) => {
    const response = await api.put(
      `/faculty-preferences/${preferenceId}`,
      updateData
    );
    return response.data;
  },

  /**
   * Delete a preference
   * 
   * @async
   * @param {number} preferenceId - Preference ID
   * @returns {Promise<void>}
   * 
   * @example
   * await facultyService.deletePreference(123);
   */
  deletePreference: async (preferenceId) => {
    await api.delete(`/faculty-preferences/${preferenceId}`);
  },

  /**
   * Get preference by ID
   * 
   * @async
   * @param {number} preferenceId - Preference ID
   * @returns {Promise<Object>} Preference details
   */
  getPreferenceDetail: async (preferenceId) => {
    const response = await api.get(`/faculty-preferences/${preferenceId}`);
    return response.data;
  }
};

export default facultyService;
