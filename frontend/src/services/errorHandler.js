export const getErrorMessage = (error) => {
  if (!error) {
    return "Something went wrong";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  return "Something went wrong";
};

export const handleApiError = (error) => {
  const message = getErrorMessage(error);

  console.error("API Error:", error);

  return {
    success: false,
    message,
  };
};

export default {
  getErrorMessage,
  handleApiError,
};