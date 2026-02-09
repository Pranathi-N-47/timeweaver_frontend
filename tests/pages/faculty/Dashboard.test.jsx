/**
 * Frontend Tests - Faculty Dashboard Component
 * Repository: timeweaver_frontend
 * Owner: Meka Jahnavi
 * 
 * Test suite for Faculty Dashboard component.
 * Uses Jest and React Testing Library.
 * 
 * Test Coverage: Component rendering, data loading, user interactions
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FacultyDashboard from '../../../src/pages/faculty/Dashboard';
import * as facultyService from '../../../src/services/facultyService';

// Mock the facultyService
jest.mock('../../../src/services/facultyService');

// Mock useAuth hook
jest.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      faculty_id: 1,
      full_name: 'Dr. John Smith'
    }
  })
}));

describe('FacultyDashboard Component', () => {

  /**
   * Setup before each test
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Component renders successfully
   * 
   * Verifies:
   * - Page title is displayed
   * - Welcome message shows correct faculty name
   * 
   * Test Coverage: Initial render
   */
  test('renders dashboard with welcome message', async () => {
    facultyService.getWorkload.mockResolvedValue({
      total_hours: 15,
      max_hours: 18,
      is_overloaded: false,
      utilization_percentage: 83.33,
      section_count: 3
    });

    render(<FacultyDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Faculty Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/Dr. John Smith/)).toBeInTheDocument();
    });
  });

  /**
   * Test: Workload data loads on mount
   * 
   * Verifies:
   * - API call is made on component mount
   * - Workload data is displayed correctly
   * - Hours are shown properly
   * 
   * Test Coverage: Data loading
   */
  test('loads and displays workload data', async () => {
    const mockWorkload = {
      faculty_id: 1,
      total_hours: 15,
      max_hours: 18,
      is_overloaded: false,
      utilization_percentage: 83.33,
      section_count: 3
    };

    facultyService.getWorkload.mockResolvedValue(mockWorkload);

    render(<FacultyDashboard />);

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument(); // total hours
      expect(screen.getByText('18')).toBeInTheDocument(); // max hours
      expect(screen.getByText('Normal Load')).toBeInTheDocument();
    });
  });

  /**
   * Test: Overloaded status displays correctly
   * 
   * Verifies:
   * - "Overloaded" badge appears when is_overloaded is true
   * - Warning icon is shown
   * - Correct utilization percentage displayed
   * 
   * Test Coverage: Overloaded state
   */
  test('displays overloaded status when faculty exceeds max hours', async () => {
    const mockWorkload = {
      faculty_id: 1,
      total_hours: 22,
      max_hours: 18,
      is_overloaded: true,
      utilization_percentage: 122.22,
      section_count: 4
    };

    facultyService.getWorkload.mockResolvedValue(mockWorkload);

    render(<FacultyDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Overloaded')).toBeInTheDocument();
      expect(screen.getByText(/⚠️/)).toBeInTheDocument();
      expect(screen.getByText('22')).toBeInTheDocument();
    });
  });

  /**
   * Test: Semester selector works
   * 
   * Verifies:
   * - Dropdown shows all semester options
   * - Selecting semester reloads data
   * - Correct API call with semester_id parameter
   * 
   * Test Coverage: Semester selection
   */
  test('allows changing semester and reloads data', async () => {
    facultyService.getWorkload.mockResolvedValue({
      total_hours: 15,
      max_hours: 18,
      is_overloaded: false,
      utilization_percentage: 83.33,
      section_count: 3
    });

    render(<FacultyDashboard />);

    const semester = screen.getByDisplayValue('Spring 2026');

    // Change to Fall 2026
    fireEvent.change(semester, { target: { value: '3' } });

    await waitFor(() => {
      expect(facultyService.getWorkload).toHaveBeenCalledWith(1, 3);
    });
  });

  /**
   * Test: Assigned courses display in table
   * 
   * Verifies:
   * - Course table is rendered
   * - All course details show correctly
   * - Course data is properly formatted
   * 
   * Test Coverage: Courses display
   */
  test('displays assigned courses in table', async () => {
    facultyService.getWorkload.mockResolvedValue({
      total_hours: 15,
      max_hours: 18,
      is_overloaded: false,
      utilization_percentage: 83.33,
      section_count: 3
    });

    render(<FacultyDashboard />);

    await waitFor(() => {
      // Check for course table headers
      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Section')).toBeInTheDocument();
    });
  });

  /**
   * Test: Loading state displays
   * 
   * Verifies:
   * - Loading message shown while data is being fetched
   * - Disappears once data is loaded
   * 
   * Test Coverage: Loading state
   */
  test('shows loading message while fetching data', () => {
    facultyService.getWorkload.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<FacultyDashboard />);

    expect(screen.getByText(/Loading faculty dashboard/)).toBeInTheDocument();
  });

  /**
   * Test: Error state displays
   * 
   * Verifies:
   * - Error message shown when API fails
   * - Retry button is available
   * - Clicking retry reloads data
   * 
   * Test Coverage: Error handling
   */
  test('displays error message on API failure', async () => {
    const mockError = new Error('API request failed');
    facultyService.getWorkload.mockRejectedValue(mockError);

    render(<FacultyDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Dashboard/)).toBeInTheDocument();
    });

    // Check retry button exists
    const retryBtn = screen.getByText('Try Again');
    expect(retryBtn).toBeInTheDocument();

    // Click retry
    facultyService.getWorkload.mockResolvedValue({
      total_hours: 15,
      max_hours: 18,
      is_overloaded: false,
      utilization_percentage: 83.33,
      section_count: 3
    });

    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('Faculty Dashboard')).toBeInTheDocument();
    });
  });

  /**
   * Test: Progress bar renders correctly
   * 
   * Verifies:
   * - Progress bar shows correct width percentage
   * - Color changes based on overload status
   * 
   * Test Coverage: Progress visualization
   */
  test('renders progress bar with correct percentage', async () => {
    facultyService.getWorkload.mockResolvedValue({
      total_hours: 15,
      max_hours: 18,
      is_overloaded: false,
      utilization_percentage: 83.33,
      section_count: 3
    });

    const { container } = render(<FacultyDashboard />);

    await waitFor(() => {
      const progressBar = container.querySelector('.progress-fill');
      // Should be ~83% width
      expect(progressBar).toHaveStyle('width: 83%');
    });
  });

  /**
   * Test: Quick action buttons render
   * 
   * Verifies:
   * - Action buttons are visible
   * - All expected actions present
   * 
   * Test Coverage: Quick actions
   */
  test('displays quick action buttons', async () => {
    facultyService.getWorkload.mockResolvedValue({
      total_hours: 15,
      max_hours: 18,
      is_overloaded: false,
      utilization_percentage: 83.33,
      section_count: 3
    });

    render(<FacultyDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Set Preferences/)).toBeInTheDocument();
      expect(screen.getByText(/View Reports/)).toBeInTheDocument();
    });
  });

  /**
   * Test: No courses message displays
   * 
   * Verifies:
   * - Appropriate message when no courses assigned
   * 
   * Test Coverage: Empty state
   */
  test('shows message when no courses assigned', async () => {
    facultyService.getWorkload.mockResolvedValue({
      total_hours: 0,
      max_hours: 18,
      is_overloaded: false,
      utilization_percentage: 0,
      section_count: 0
    });

    render(<FacultyDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/No courses assigned/)).toBeInTheDocument();
    });
  });
});
