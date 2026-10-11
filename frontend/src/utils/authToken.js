export const getTokenExpiration = (token) => {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedPayload = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "="
    );

    const decodedPayload = JSON.parse(atob(paddedPayload));

    if (
      typeof decodedPayload.exp !== "number" ||
      !Number.isFinite(decodedPayload.exp)
    ) {
      return null;
    }

    return decodedPayload.exp * 1000;
  } catch {
    return null;
  }
};

export const isTokenValid = (token) => {
  const expiration = getTokenExpiration(token);

  return expiration !== null && expiration > Date.now();
};
