/**
 * Workload Chart Component
 * Repository: timeweaver_frontend
 * Owner: Meka Jahnavi
 * 
 * Visualizes faculty teaching workload with:
 * - Hours bar chart
 * - Utilization percentage
 * - Color-coded status (normal/overloaded)
 * 
 * Dependencies:
 *   - A charting library (Chart.js, Recharts, or canvas-based)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.workload - Workload data object
 * @param {number} props.workload.total_hours - Total teaching hours
 * @param {number} props.workload.max_hours - Maximum allowed hours
 * @param {boolean} props.workload.is_overloaded - Overload status
 * @param {number} props.workload.utilization_percentage - Utilization %
 * 
 * @example
 * <WorkloadChart workload={workloadData} />
 */

import React from 'react';
import './WorkloadChart.css';

function WorkloadChart({ workload }) {
  if (!workload) {
    return <div className="workload-chart placeholder">No workload data</div>;
  }

  const {
    total_hours = 0,
    max_hours = 18,
    is_overloaded = false,
    utilization_percentage = 0
  } = workload;

  /**
   * Calculate visual width for bar
   * Max bar represents 125% of max_hours for visual perspective
   */
  const maxVisualHours = max_hours * 1.25;
  const barWidth = Math.min((total_hours / maxVisualHours) * 100, 100);

  /**
   * Determine colors based on status
   */
  const getStatusColor = () => {
    if (utilization_percentage >= 100) return '#e74c3c'; // Red - overloaded
    if (utilization_percentage >= 80) return '#f39c12'; // Orange - high
    return '#27ae60'; // Green - normal
  };

  /**
   * Format hours display
   */
  const formatHours = (hours) => `${hours.toFixed(1)}h`;

  return (
    <div className="workload-chart">
      {/* Title */}
      <div className="chart-header">
        <h4>Workload Distribution</h4>
        <div className={`status-indicator ${is_overloaded ? 'overloaded' : 'normal'}`}>
          {is_overloaded ? '⚠️ Overloaded' : '✓ Normal'}
        </div>
      </div>

      {/* Hours Bar */}
      <div className="chart-section hours-section">
        <div className="chart-label">Teaching Hours</div>

        {/* Bar Container */}
        <div className="bar-container">
          {/* Max line indicator */}
          <div className="max-line" style={{ left: `${(max_hours / maxVisualHours) * 100}%` }}>
            <div className="max-label">Max ({max_hours}h)</div>
          </div>

          {/* Actual bar */}
          <div
            className="progress-bar"
            style={{
              width: `${barWidth}%`,
              backgroundColor: getStatusColor(),
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }}
          >
            <span className="bar-text">{formatHours(total_hours)}</span>
          </div>
        </div>

        {/* Hours numbers */}
        <div className="hours-legend">
          <span>0h</span>
          <span>{formatHours(max_hours)}</span>
          <span>{formatHours(maxVisualHours)}</span>
        </div>
      </div>

      {/* Utilization Meter */}
      <div className="chart-section utilization-section">
        <div className="chart-label">Utilization Rate</div>

        {/* Circular meter */}
        <div className="utilization-meter">
          <svg viewBox="0 0 120 120" className="meter-svg">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#ecf0f1"
              strokeWidth="8"
            />

            {/* Utilization arc */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={getStatusColor()}
              strokeWidth="8"
              strokeDasharray={`${(utilization_percentage / 100) * 314} 314`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>

          {/* Center text */}
          <div className="meter-text">
            <span className="meter-percentage">{utilization_percentage.toFixed(0)}%</span>
            <span className="meter-label">Utilized</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="chart-section stats-grid">
        <div className="stat">
          <span className="stat-label">Assigned Hours:</span>
          <span className="stat-value">{formatHours(total_hours)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Maximum Hours:</span>
          <span className="stat-value">{formatHours(max_hours)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining:</span>
          <span className={`stat-value ${total_hours > max_hours ? 'danger' : ''}`}>
            {Math.max(0, max_hours - total_hours).toFixed(1)}h
          </span>
        </div>
      </div>

      {/* Status Message */}
      <div className={`status-message ${is_overloaded ? 'overloaded' : 'normal'}`}>
        {is_overloaded ? (
          <>
            <span className="icon">⚠️</span>
            <span className="message">
              Faculty is overloaded by {(total_hours - max_hours).toFixed(1)} hours.
              Consider reassigning some courses.
            </span>
          </>
        ) : (
          <>
            <span className="icon">✓</span>
            <span className="message">
              Workload is within acceptable limits. 
              {max_hours - total_hours > 0 && (
                <> Can accommodate up to {(max_hours - total_hours).toFixed(1)} more hours.</>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkloadChart;
