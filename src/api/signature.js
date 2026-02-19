import axios from "./axios"; // pre-configured axios instance

/**
 * CREATE single signature
 * POST /api/signatures
 */
export const createSignature = (payload) =>
  axios.post("/api/signatures", payload);

/**
 * SAVE / UPDATE elements (drag + resize support)
 * POST /api/signatures/save-elements
 */
export const saveElements = (payload) =>
  axios.post("/api/signatures/save-elements", payload);

/**
 * GET all signatures for a file
 * GET /api/signatures/file/:fileId
 */
export const getSignaturesByFile = (fileId) =>
  axios.get(`/api/signatures/file/${fileId}`);

/**
 * SIGN a document
 * PATCH /api/signatures/:id/sign
 */
export const signDocument = (signatureId, signerId) =>
  axios.patch(`/api/signatures/${signatureId}/sign`, {
    signerId, // required because backend checks signer
  });

/**
 * DELETE signature element
 * DELETE /api/signatures/:id
 */
export const deleteSignature = (id) =>
  axios.delete(`/api/signatures/${id}`);
/**
 * GENERATE + UPLOAD final signed PDF to cloud
 */
export const uploadSignedPDF = (fileId) =>
  axios.post(`/api/signatures/${fileId}/upload`);

export const inviteSigner = (payload) =>
  axios.post("/api/signatures/invite", payload);

export const getSignatureByToken = (token) =>
  axios.get(`/api/signatures/public/${token}`);