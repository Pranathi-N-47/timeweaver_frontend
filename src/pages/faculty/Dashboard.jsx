/**
 * Faculty Dashboard Component
 * Repository: timeweaver_frontend
 * Owner: Meka Jahnavi
 * 
 * Main dashboard for faculty members showing:
 * - Teaching workload and utilization
 * - Assigned courses for current semester
 * - Quick actions and navigation
 * 
 * @component
 * @example
 * <FacultyDashboard />
 */

import { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { useAuth } from '../../hooks/useAuth';
import WorkloadChart from '../../components/WorkloadChart/WorkloadChart';
import './Dashboard.css';

function FacultyDashboard() {
  // State management
  const [workload, setWorkload] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1);

  // Get current user/faculty info
  const { user } = useAuth();

  /**
   * Load faculty workload and course data
   * Called on component mount and semester change
   * 
   * @async
   * @function loadFacultyData
   */
  const loadFacultyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get workload for current semester
      const workloadData = await facultyService.getWorkload(
        user.faculty_id,
        selectedSemester
      );
      setWorkload(workloadData);

      // In production: also fetch courses assigned to faculty
      // const coursesData = await facultyService.getFacultyDetail(user.faculty_id);
      // setCourses(coursesData.courses || []);

      // Mock data for demo
      setCourses([
        {
          id: 1,
          code: 'CS101',
          title: 'Introduction to Computer Science',
          section: 'A',
          lecture_hours: 3,
          tutorial_hours: 1,
          students: 45
        },
        {
          id: 2,
          code: 'CS201',
          title: 'Data Structures',
          section: 'B',
          lecture_hours: 4,
          tutorial_hours: 2,
          students: 38
        },
        {
          id: 3,
          code: 'CS301',
          title: 'Algorithms',
          section: 'A',
          lecture_hours: 3,
          tutorial_hours: 1,
          students: 32
        }
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load faculty data');
      console.error('Error loading faculty data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lifecycle: Load data on component mount
   */
  useEffect(() => {
    loadFacultyData();
  }, [selectedSemester, user?.faculty_id]);

  /**
   * Handle semester selection change
   * @param {Event} e - Select element event
   */
  const handleSemesterChange = (e) => {
    setSelectedSemester(parseInt(e.target.value, 10));
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="faculty-dashboard loading">
        <div className="spinner">Loading faculty dashboard...</div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="faculty-dashboard error">
        <div className="error-message">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={loadFacultyData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Faculty Dashboard</h1>
        <p className="subtitle">Welcome, {user?.full_name}</p>
      </div>

      {/* Semester Selector */}
      <div className="semester-selector">
        <label htmlFor="semester-select">Select Semester:</label>
        <select
          id="semester-select"
          value={selectedSemester}
          onChange={handleSemesterChange}
          className="semester-dropdown"
        >
          <option value={1}>Spring 2026</option>
          <option value={2}>Summer 2026</option>
          <option value={3}>Fall 2026</option>
          <option value={4}>Winter 2026</option>
        </select>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Workload Card */}
        <section className="workload-section">
          <div className="card workload-card">
            <h2 className="card-title">Teaching Workload</h2>

            {workload && (
              <>
                {/* Workload Metrics */}
                <div className="workload-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Total Hours:</span>
                    <span className="metric-value">{workload.total_hours}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Maximum Hours:</span>
                    <span className="metric-value">{workload.max_hours}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Utilization:</span>
                    <span className="metric-value">
                      {workload.utilization_percentage}%
                    </span>
                  </div>
                </div>

                {/* Workload Status Badge */}
                <div className={`status-badge ${workload.is_overloaded ? 'overloaded' : 'normal'}`}>
                  {workload.is_overloaded ? (
                    <>
                      <span className="warning-icon">⚠️</span>
                      <span>Overloaded</span>
                    </>
                  ) : (
                    <>
                      <span className="success-icon">✓</span>
                      <span>Normal Load</span>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${workload.is_overloaded ? 'danger' : 'success'}`}
                      style={{
                        width: `${Math.min(workload.utilization_percentage, 100)}%`
                      }}
                    />
                  </div>
                  <span className="progress-text">
                    {workload.total_hours} / {workload.max_hours} hours
                  </span>
                </div>

                {/* Number of Assigned Sections */}
                <div className="section-count">
                  <p>Assigned to <strong>{workload.section_count}</strong> section(s)</p>
                </div>
              </>
            )}
          </div>

          {/* Workload Chart */}
          <div className="card chart-card">
            <h3 className="card-title">Workload Visualization</h3>
            {workload && <WorkloadChart workload={workload} />}
          </div>
        </section>

        {/* Courses Section */}
        <section className="courses-section">
          <div className="card courses-card">
            <h2 className="card-title">Assigned Courses</h2>

            {courses.length > 0 ? (
              <div className="courses-list">
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Title</th>
                      <th>Section</th>
                      <th>Hours</th>
                      <th>Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="course-row">
                        <td className="course-code">{course.code}</td>
                        <td className="course-title">{course.title}</td>
                        <td className="course-section">{course.section}</td>
                        <td className="course-hours">
                          {course.lecture_hours}L + {course.tutorial_hours}T
                        </td>
                        <td className="course-students">{course.students}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-courses-message">
                No courses assigned for this semester.
              </p>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="card actions-card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn primary">
                📅 Set Preferences
              </button>
              <button className="action-btn secondary">
                📧 Send Message
              </button>
              <button className="action-btn secondary">
                📊 View Reports
              </button>
              <button className="action-btn secondary">
                👤 Edit Profile
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FacultyDashboard;
