import { api } from "./api";

export const getSlides = async () => {
  const response = await api.get("/slides");
  return response.slides;
};

export const getSlidesByCase = async (caseId) => {
  const response = await api.get(`/slides/case/${caseId}`);
  return response.slides;
};

export const createSlide = async (slideData) => {
  const response = await api.post("/slides", slideData);
  return response.slide;
};

export const updateSlide = async (slideId, slideData) => {
  const response = await api.put(`/slides/${slideId}`, slideData);
  return response.slide;
};