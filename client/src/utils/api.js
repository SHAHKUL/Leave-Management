import axios from "axios";

const API_URL = "https://leave-management-gp7l.onrender.com/api";

// Create axios instance (recommended)
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.response?.data || error.message;
    return Promise.reject(new Error(message));
  },
);

export const api = {
  login: async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return data;
  },

  register: async ( name,email, password,) => {
    const { data } = await axiosInstance.post("/auth/register", {
      email,
      password,
      name,
    });
    return data;
  },

  getUserById: async (token, id) => {
    const { data } = await axiosInstance.get(`auth/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // pass the token if protected
      },
    });
    return data;
  },

  getLeaveRequest: async (token) => {
    const { data } = await axiosInstance.get("/leave-request/get", {
      headers: {
        Authorization: `Bearer ${token}`, // send token here
      },
    });
    return data;
  },

  getLeaves: async (token) => {
    const { data } = await axiosInstance.get("/leave-request/all", {
      headers: {
        Authorization: `Bearer ${token}`, // send token here
      },
    });
    return data;
  },

  getLeaveTypes: async () => {
    const { data } = await axiosInstance.get("/leave-types");
    return data;
  },

  createLeave: async (leaveData) => {
    const { data } = await axiosInstance.post(
      "/leave-request/apply",
      leaveData,
    );
    return data;
  },

  updateLeaveStatus: async (id, status, managerId, comment, token) => {
    const { data } = await axiosInstance.post(
      `/leave-request/approve/${id}`,
      {
        status,
        managerId,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // send token here
        },
      },
    );
    return data;
  },

  updateUserLeaveStatus: async (id, status) => {
    const { data } = await axiosInstance.put(`/leave-request/update/${id}`, {
      status,
    });
    return data;
  },

  getBalances: async (token) => {
    const { data } = await axiosInstance.get("/leave-balance", {
      headers: {
        Authorization: `Bearer ${token}`, // send token here
      },
    });
    return data;
  },

  getOneBalances: async (token, id) => {
    const { data } = await axiosInstance.get(`/leave-balance/my/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // send token here
      },
    });
    return data;
  },


  // Leave Types APIs
getLeaveTypes2: async (token) => {
  const { data } = await axiosInstance.get("/leave-types", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
},

createLeaveType: async (token, payload) => {
  const { data } = await axiosInstance.post("/leave-types", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
},

updateLeaveType: async (token, id, payload) => {
  const { data } = await axiosInstance.put(`/leave-types/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
},

deleteLeaveType: async (token, id) => {
  const { data } = await axiosInstance.delete(`/leave-types/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
},

};
