
export const INACTIVITY_LIMIT = 3600000; // 1 hour in milliseconds
const ACTIVITY_KEY = 'halabi_last_activity';

/**
 * Updates the last activity timestamp in localStorage.
 */
export const updateActivity = () => {
  localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
};

/**
 * Checks if the user has been inactive for longer than the limit.
 * If so, clears sensitive data from localStorage.
 */
export const checkAndClearInactivity = () => {
  const lastActivity = localStorage.getItem(ACTIVITY_KEY);
  if (!lastActivity) {
    updateActivity();
    return false;
  }
  
  const now = Date.now();
  if (now - parseInt(lastActivity) > INACTIVITY_LIMIT) {
    // Clear security sensitive items
    // These keys are common conventions for storing API keys in persistent browser state
    localStorage.removeItem('aistudio_api_key');
    localStorage.removeItem('aistudio_selected_key_id');
    localStorage.removeItem('halabi_ai_usage'); // Optional: reset daily usage as well
    
    // Clear activity timestamp to avoid repeat logic until next interaction
    localStorage.removeItem(ACTIVITY_KEY);
    return true;
  }
  return false;
};
