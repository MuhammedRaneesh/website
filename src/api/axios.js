import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4001/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (
            (status === 401 || status === 403) &&
            message === "Your account has been blocked by admin"
        ) {
            localStorage.removeItem("AuthUser");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
