/**
 * Faculty Preferences Page Component
 * Repository: timeweaver_frontend
 * Owner: Meka Jahnavi
 * 
 * Allows faculty to set time slot preferences:
 * - Mark preferred teaching times
 * - Mark unavailable times
 * - Visual weekly grid interface
 * - Save and manage preferences
 * 
 * @component
 * @example
 * <FacultyPreferences />
 */

import { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { useAuth } from '../../hooks/useAuth';
import './Preferences.css';

/**
 * Days of week with 0-6 mapping
 */
const DAYS_OF_WEEK = [
  { id: 0, name: 'Monday' },
  { id: 1, name: 'Tuesday' },
  { id: 2, name: 'Wednesday' },
  { id: 3, name: 'Thursday' },
  { id: 4, name: 'Friday' }
];

/**
 * Time slots (sample - would come from API in production)
 */
const TIME_SLOTS = [
  { id: 1, time: '08:00 - 09:30', period: 'Morning' },
  { id: 2, time: '09:45 - 11:15', period: 'Morning' },
  { id: 3, time: '11:30 - 01:00', period: 'Afternoon' },
  { id: 4, time: '01:00 - 02:30', period: 'Afternoon' },
  { id: 5, time: '02:45 - 04:15', period: 'Evening' }
];

function FacultyPreferences() {
  // State management
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);

  // Get current user/faculty
  const { user } = useAuth();

  /**
   * Load faculty preferences from backend
   * @async
   */
  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await facultyService.getPreferences(user.faculty_id);
      setPreferences(data || []);
    } catch (err) {
      setError('Failed to load preferences');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lifecycle: Load preferences on mount
   */
  useEffect(() => {
    loadPreferences();
  }, [user?.faculty_id]);

  /**
   * Check if a specific slot has a preference
   * @param {number} dayId - Day of week (0-6)
   * @param {number} slotId - Time slot ID
   * @returns {Object|null} Preference object or null
   */
  const getPreference = (dayId, slotId) => {
    return preferences.find(
      (p) => p.day_of_week === dayId && p.time_slot_id === slotId
    );
  };

  /**
   * Get preference type for a slot (preferred/not_available/none)
   * @param {number} dayId - Day of week
   * @param {number} slotId - Time slot ID
   * @returns {string} Preference type
   */
  const getPreferenceType = (dayId, slotId) => {
    const pref = getPreference(dayId, slotId);
    return pref ? pref.preference_type : 'none';
  };

  /**
   * Toggle preference for a time slot
   * Cycles through: none -> not_available -> preferred -> none
   * 
   * @async
   * @param {number} dayId - Day of week
   * @param {number} slotId - Time slot ID
   */
  const togglePreference = async (dayId, slotId) => {
    try {
      setSaving(true);
      setSuccess(null);

      const currentPref = getPreference(dayId, slotId);
      let newType;

      // Cycle through options
      if (!currentPref) {
        newType = 'not_available';
      } else if (currentPref.preference_type === 'not_available') {
        newType = 'preferred';
      } else {
        // Delete preference (back to none)
        await facultyService.deletePreference(currentPref.id);
        setPreferences(
          preferences.filter((p) => p.id !== currentPref.id)
        );
        setSuccess('Preference removed');
        setSaving(false);
        return;
      }

      // Create or update preference
      const preferenceData = {
        day_of_week: dayId,
        time_slot_id: slotId,
        preference_type: newType
      };

      if (currentPref) {
        // Update
        const updated = await facultyService.updatePreference(
          currentPref.id,
          preferenceData
        );
        setPreferences(
          preferences.map((p) =>
            p.id === currentPref.id ? updated : p
          )
        );
      } else {
        // Create
        const newPref = await facultyService.setPreference(
          user.faculty_id,
          preferenceData
        );
        setPreferences([...preferences, newPref]);
      }

      setSuccess('Preference updated');
    } catch (err) {
      setError('Failed to update preference');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Clear all preferences
   * @async
   */
  const clearAllPreferences = async () => {
    if (
      !window.confirm(
        'Are you sure you want to clear all preferences? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setSuccess(null);

      // Delete all preferences
      await Promise.all(
        preferences.map((p) => facultyService.deletePreference(p.id))
      );

      setPreferences([]);
      setSuccess('All preferences cleared');
    } catch (err) {
      setError('Failed to clear preferences');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Get CSS class for preference cell
   * @param {number} dayId - Day of week
   * @param {number} slotId - Time slot ID
   * @returns {string} CSS class name
   */
  const getSlotClass = (dayId, slotId) => {
    const type = getPreferenceType(dayId, slotId);
    return `slot ${type}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="preferences-page loading">
        <div className="spinner">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="preferences-page">
      {/* Header */}
      <div className="page-header">
        <h1>Time Slot Preferences</h1>
        <p className="subtitle">Set your preferred and unavailable teaching times</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={() => setSuccess(null)} className="alert-close">×</button>
        </div>
      )}

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-box none"></div>
          <span>No preference</span>
        </div>
        <div className="legend-item">
          <div className="legend-box not_available"></div>
          <span>Not available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box preferred"></div>
          <span>Preferred</span>
        </div>
      </div>

      {/* Preference Grid */}
      <div className="preferences-grid">
        <div className="grid-container">
          {/* Time slot labels (left column) */}
          <div className="time-labels">
            <div className="corner-cell"></div>
            {TIME_SLOTS.map((slot) => (
              <div key={slot.id} className="time-label">
                <div className="slot-time">{slot.time}</div>
                <div className="slot-period">{slot.period}</div>
              </div>
            ))}
          </div>

          {/* Days and slots grid */}
          <div className="days-grid">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.id} className="day-column">
                {/* Day header */}
                <div className="day-header">{day.name}</div>

                {/* Time slots for this day */}
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={`${day.id}-${slot.id}`}
                    className={getSlotClass(day.id, slot.id)}
                    onClick={() => togglePreference(day.id, slot.id)}
                    disabled={saving}
                    title={`Click to cycle: None → Not Available → Preferred → None`}
                  >
                    <span className="preference-icon">
                      {getPreferenceType(day.id, slot.id) === 'not_available' && '✗'}
                      {getPreferenceType(day.id, slot.id) === 'preferred' && '✓'}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <h3>How to use:</h3>
        <ul>
          <li>Click on any time slot to toggle your preference</li>
          <li><strong>No color:</strong> No preference (can teach or not teach)</li>
          <li><strong>Red (✗):</strong> Unavailable (cannot teach at this time)</li>
          <li><strong>Green (✓):</strong> Preferred (would like to teach)</li>
          <li>Your preferences will be used in timetable generation</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={loadPreferences}
          disabled={saving}
        >
          ↻ Reload Preferences
        </button>
        <button
          className="btn btn-danger"
          onClick={clearAllPreferences}
          disabled={saving || preferences.length === 0}
        >
          🗑️ Clear All Preferences
        </button>
      </div>

      {/* Statistics */}
      <div className="statistics">
        <div className="stat-item">
          <span className="stat-label">Total Preferences Set:</span>
          <span className="stat-value">{preferences.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Unavailable Slots:</span>
          <span className="stat-value">
            {preferences.filter((p) => p.preference_type === 'not_available').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Preferred Slots:</span>
          <span className="stat-value">
            {preferences.filter((p) => p.preference_type === 'preferred').length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FacultyPreferences;
