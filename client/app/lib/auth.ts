import API from "./axios";

export const isAuthenticated = async () => {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    await API.get("/auth/profile");
    return true;
  } catch (error) {
    return false;
  }
}

export const logout = async () => {
  if (typeof window !== "undefined") {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}