import api from "./api.js";

export const resumeService = {
  getResumes: async (params = {}) => {
    const response = await api.get("/resumes", { params });
    return response.data;
  },

  getResume: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  createResume: async (resumeData) => {
    const response = await api.post("/resumes", resumeData);
    return response.data;
  },

  updateResume: async (id, resumeData) => {
    const response = await api.put(`/resumes/${id}`, resumeData);
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  duplicateResume: async (id) => {
    const response = await api.post(`/resumes/${id}/duplicate`);
    return response.data;
  },

  toggleArchive: async (id) => {
    const response = await api.patch(`/resumes/${id}/archive`);
    return response.data;
  },

  trackDownload: async (id) => {
    const response = await api.post(`/resumes/${id}/download`);
    return response.data;
  },

  getPublicResume: async (slug) => {
    const response = await api.get(`/resumes/public/${slug}`);
    return response.data;
  },
};

export default resumeService;