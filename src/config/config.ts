import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})



export const getErrorMessage = (error: any) => {

    if (!navigator.onLine) {
        return "No internet connection. Please check your network and try again.";
    }
    if (error.request && !error.response) {
        return "Unable to  reach the server. Please try again later"
    }
    if (error && axios.isAxiosError(error)) {
        const status = error?.response?.status;
        const statusMessages: Record<number, string> = {
            500: "Something went wrong on our side. Please try again in a moment.",
            502: "We’re having trouble connecting to the server. Please try again later.",
            503: "Service is unavailable. Please try again later.",
            504: "The request took too long. Please try again.",
            404: "Page not found"
        }
        // const errorMessage = error?.response?.data.message || error.response.data.error


        return status && statusMessages[status] ? statusMessages[status] : error?.response?.data?.message || error?.response?.data?.error
    }
}

api.interceptors.response.use(
    response => response,
    error => {
        error.message = getErrorMessage(error)
        return Promise.reject(error)
    }
)


