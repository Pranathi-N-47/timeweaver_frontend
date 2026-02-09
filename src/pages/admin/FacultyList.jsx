/**
 * Admin Faculty List Component
 * Repository: timeweaver_frontend
 * Owner: Meka Jahnavi
 * 
 * Admin interface for managing faculty:
 * - View all faculty members
 * - Create new faculty profiles
 * - Edit faculty information
 * - Delete faculty accounts
 * - View workload status
 * 
 * @component
 * @example
 * <AdminFacultyList />
 */

import { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import FacultyListTable from '../../components/FacultyListTable/FacultyListTable';
import FacultyForm from '../../components/FacultyForm/FacultyForm';
import './FacultyList.css';

function AdminFacultyList() {
  // State management
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [paginationPage, setPaginationPage] = useState(1);
  const itemsPerPage = 20;

  /**
   * Load all faculty from backend
   * @async
   */
  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError(null);

      const skip = (paginationPage - 1) * itemsPerPage;
      const data = await facultyService.getFacultyList(skip, itemsPerPage);
      setFaculty(data);
    } catch (err) {
      setError('Failed to load faculty list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lifecycle: Load faculty on mount and pagination change
   */
  useEffect(() => {
    loadFaculty();
  }, [paginationPage]);

  /**
   * Handle form submission (create or update)
   * @async
   * @param {Object} formData - Faculty data from form
   */
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      if (editingFacultyId) {
        // Update existing faculty
        await facultyService.updateFaculty(editingFacultyId, formData);
        setSuccess('Faculty updated successfully');
      } else {
        // Create new faculty
        await facultyService.createFaculty(formData);
        setSuccess('Faculty created successfully');
      }

      setShowForm(false);
      setEditingFacultyId(null);
      loadFaculty();
    } catch (err) {
      setError(err.message || 'Failed to save faculty');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete faculty
   * @async
   * @param {number} facultyId - Faculty ID to delete
   */
  const handleDelete = async (facultyId) => {
    if (
      !window.confirm('Are you sure you want to delete this faculty? This action cannot be undone.')
    ) {
      return;
    }

    try {
      setLoading(true);
      await facultyService.deleteFaculty(facultyId);
      setSuccess('Faculty deleted successfully');
      loadFaculty();
    } catch (err) {
      setError('Failed to delete faculty');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit button click
   * @param {number} facultyId - Faculty ID to edit
   */
  const handleEdit = (facultyId) => {
    setEditingFacultyId(facultyId);
    setShowForm(true);
  };

  /**
   * Close form and reset state
   */
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFacultyId(null);
  };

  /**
   * Filter faculty based on search and department
   * @returns {Array} Filtered faculty list
   */
  const getFilteredFaculty = () => {
    return faculty.filter((f) => {
      const matchesSearch =
        f.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.designation?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        filterDepartment === 'all' || f.department_id === parseInt(filterDepartment);

      return matchesSearch && matchesDepartment;
    });
  };

  const filteredFaculty = getFilteredFaculty();

  return (
    <div className="admin-faculty-list">
      {/* Header */}
      <div className="page-header">
        <h1>Faculty Management</h1>
        <p className="subtitle">Manage faculty profiles and assignments</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="alert-close">
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={() => setSuccess(null)} className="alert-close">
            ×
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="controls-section">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          ➕ Add New Faculty
        </button>

        <div className="search-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search by employee ID or designation..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPaginationPage(1);
            }}
          />

          <select
            className="filter-dropdown"
            value={filterDepartment}
            onChange={(e) => {
              setFilterDepartment(e.target.value);
              setPaginationPage(1);
            }}
          >
            <option value="all">All Departments</option>
            <option value="1">Computer Science</option>
            <option value="2">Electronics</option>
            <option value="3">Mechanical</option>
            <option value="4">Civil</option>
          </select>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {editingFacultyId ? 'Edit Faculty' : 'Add New Faculty'}
              </h2>
              <button
                className="modal-close"
                onClick={handleCloseForm}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <FacultyForm
              facultyId={editingFacultyId}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
              isLoading={loading}
            />
          </div>
        </div>
      )}

      {/* Faculty Table */}
      <div className="faculty-table-section">
        {loading && !showForm ? (
          <div className="spinner">Loading faculty...</div>
        ) : filteredFaculty.length > 0 ? (
          <>
            <FacultyListTable
              faculty={filteredFaculty}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={loading}
            />

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => setPaginationPage(Math.max(1, paginationPage - 1))}
                disabled={paginationPage === 1 || loading}
              >
                ← Previous
              </button>
              <span className="page-info">Page {paginationPage}</span>
              <button
                onClick={() => setPaginationPage(paginationPage + 1)}
                disabled={filteredFaculty.length < itemsPerPage || loading}
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="no-data-message">
            <p>No faculty members found.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Create the first faculty member
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="statistics-section">
        <div className="stat-card">
          <span className="stat-label">Total Faculty:</span>
          <span className="stat-value">{faculty.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Displayed:</span>
          <span className="stat-value">{filteredFaculty.length}</span>
        </div>
      </div>
    </div>
  );
}

export default AdminFacultyList;
