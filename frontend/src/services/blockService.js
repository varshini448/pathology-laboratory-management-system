import { api } from "./api";

export const getBlocks = async () => {
  const response = await api.get("/blocks");
  return response.blocks;
};

export const getBlocksByCase = async (caseId) => {
  const response = await api.get(`/blocks/case/${caseId}`);
  return response.blocks;
};

export const createBlock = async (blockData) => {
  const response = await api.post("/blocks", blockData);
  return response.block;
};

export const updateBlock = async (blockId, blockData) => {
  const response = await api.put(`/blocks/${blockId}`, blockData);
  return response.block;
};