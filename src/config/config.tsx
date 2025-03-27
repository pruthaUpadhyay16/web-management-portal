const BASE_URL = import.meta.env.VITE_API_URL; // Replace with your actual backend URL

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/v1/auth/login`,
    LOGOUT: `${BASE_URL}/api/v1/auth/logout`,
    REGISTER: `${BASE_URL}/api/v1/auth/register`,
    PROFILE: `${BASE_URL}/api/v1/auth/profile`,
    CHANGE_PASSWORD: `${BASE_URL}/api/v1/auth/change-password`,
    FORGOT_PASSWORD_REQUEST: `${BASE_URL}/api/v1/auth/forgot-password-request`,
    FORGOT_PASSWORD_RESET: `${BASE_URL}/api/v1/auth/forgot-password-reset`,
    UPDATE_EMERGENCY_ALERTS: `${BASE_URL}/api/v1/auth/update_emergency_alerts`,
    UPDATE_LOCATION_SERICES: `${BASE_URL}/api/v1/auth/update_location_services`,
  },
  ADMIN_AUTH: {
    DASHBOARD: `${BASE_URL}/api/v1/admin/dashboard`,
    LOGIN: `${BASE_URL}/api/v1/admin/login`,
    LOGOUT: `${BASE_URL}/api/v1/admin/logout`,
    PROFILE: `${BASE_URL}/api/v1/admin/profile`,
    CHANGE_PASSWORD: `${BASE_URL}/api/v1/admin/change-password`,
    FORGOT_PASSWORD_REQUEST: `${BASE_URL}/api/v1/admin/forgot-password-request`,
    FORGOT_PASSWORD_RESET: `${BASE_URL}/api/v1/admin/forgot-password-reset`,
    TEMPORARY_PASSWORD_LIST: `${BASE_URL}/api/v1/admin/temporary-password/list`,
  },
  QUICK_ACTIONS: {
    CREATE_EMERGENCY: `${BASE_URL}/api/v1/actions/emergency`,
    UPDATE_EMERGENCY: (id: string | number) =>
      `${BASE_URL}/api/v1/actions/end/emergency/${id}`,
    HISTORY: `${BASE_URL}/api/v1/actions/history`,
    RETRIEVE_ACTION: (id: string | number) =>
      `${BASE_URL}/api/v1/actions/${id}`,
  },
  EMERGENCY_CONTACTS: {
    LIST: `${BASE_URL}/api/v1/contacts/`,
    ADMIN_LIST: `${BASE_URL}/api/v1/admin/contacts`,
  },
  ADMIN_USERS: {
    LIST: `${BASE_URL}/api/v1/admin/users`,
  },
  ADMIN_ACTIONS: {
    LIST: `${BASE_URL}/api/v1/admin/actions`,
  },
};

export default API_ENDPOINTS;
