import api from "./api";

/**
 * Consent Service
 * Handles all API communication related to patient consent.
 */

/**
 * Get all consent requests.
 */
export const getConsentRequests = async () => {
    const response = await api.get("/consent");
    return response.data;
};

/**
 * Get a single consent record by ID.
 */
export const getConsentById = async (id) => {
    const response = await api.get(`/consent/${id}`);
    return response.data;
};

/**
 * Create a new consent request.
 */
export const createConsentRequest = async (data) => {
    const response = await api.post("/consent", data);
    return response.data;
};

/**
 * Update a consent request.
 */
export const updateConsentRequest = async (id, data) => {
    const response = await api.put(`/consent/${id}`, data);
    return response.data;
};

/**
 * Approve a consent request.
 */
export const approveConsent = async (id, data = {}) => {
    const response = await api.patch(
        `/consent/${id}/approve`,
        data
    );

    return response.data;
};

/**
 * Reject a consent request.
 */
export const rejectConsent = async (id, data = {}) => {
    const response = await api.patch(
        `/consent/${id}/reject`,
        data
    );

    return response.data;
};

/**
 * Revoke an existing consent.
 */
export const revokeConsent = async (id, data = {}) => {
    const response = await api.patch(
        `/consent/${id}/revoke`,
        data
    );

    return response.data;
};

/**
 * Delete a consent record.
 */
export const deleteConsent = async (id) => {
    const response = await api.delete(`/consent/${id}`);
    return response.data;
};