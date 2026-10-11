import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "../services/api";
import { uploadFile } from "../services/fileService";

const mockSuccessResponse = () => ({
  ok: true,
  json: vi.fn().mockResolvedValue({ success: true }),
});

describe("API authentication storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockSuccessResponse()));
  });

  test("API requests use the session token and ignore legacy localStorage", async () => {
    sessionStorage.setItem("token", "session-token");
    localStorage.setItem("token", "legacy-token");

    await api.get("/patients");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5001/patients",
      expect.objectContaining({
        headers: { Authorization: "Bearer session-token" },
      })
    );
  });

  test("file uploads use the session token and slide image field", async () => {
    sessionStorage.setItem("token", "session-token");

    await uploadFile("/slides/slide-1/image", new File(["image"], "slide.png"));

    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("http://localhost:5001/slides/slide-1/image");
    expect(options).toEqual(expect.objectContaining({
      method: "POST",
      headers: { Authorization: "Bearer session-token" },
    }));
    expect(options.body.get("image")).toBeInstanceOf(File);
  });

  test("file upload 401 responses notify protected routes", async () => {
    sessionStorage.setItem("token", "session-token");
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ message: "Session expired" }),
    });
    const expiredHandler = vi.fn();
    window.addEventListener("auth:expired", expiredHandler);

    await expect(
      uploadFile("/slides/slide-1/image", new File(["image"], "slide.png"))
    ).rejects.toThrow("Session expired");

    expect(expiredHandler).toHaveBeenCalledOnce();
    window.removeEventListener("auth:expired", expiredHandler);
  });
});
