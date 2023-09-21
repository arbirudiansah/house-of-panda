import userAccess from "./UserAccess";
import adminAccess from "./AdminAccess";

async function handleResponse(response: Response) {
    const text = await response.text();
    const data = text && JSON.parse(text);
    if (!response.ok) {
        if ([401, 403].includes(response.status) && (userAccess.tokenValue || adminAccess.tokenValue)) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            userAccess.logout()
            adminAccess.logout()
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}

// API request POST method
export const post = async <T>(url: string, body: any, headers?: any): Promise<T> => {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": generateAuthHeader(),
                ...headers,
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!data) throw "No response from server";
        if (data.error) throw data.error;

        return Promise.resolve(data.result);
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return Promise.reject(message);
    }
}

// API request PATCH method
export const patch = async <T>(url: string, body: any, headers?: any): Promise<T> => {
    try {
        const res = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": generateAuthHeader(),
                ...headers,
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!data) throw "No response from server";
        if (data.error) throw data.error;

        return Promise.resolve(data.result);
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return Promise.reject(message);
    }
}

// API request POST method
export const upload = async <T>(url: string, body: FormData, headers?: any): Promise<T> => {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": generateAuthHeader(),
                ...headers,
            },
            body,
        });
        const data = await res.json();
        if (!data) throw "No response from server";
        if (data.error) throw data.error;

        return Promise.resolve(data.result);
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return Promise.reject(message);
    }
}

// API request GET method
export const get = async <T>(url: string): Promise<T> => {
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": generateAuthHeader(),
            },
        });
        const data = await res.json();
        if (!data) throw "No response from server";
        if (data.error) throw data.error;

        return Promise.resolve(data.result ?? data);
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return Promise.reject(message);
    }
}

// API request DELETE method
export const mDelete = async <T>(url: string): Promise<T> => {
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": generateAuthHeader(),
            },
        });
        const data = await res.json();
        if (!data) throw "No response from server";
        if (data.error) throw data.error;

        return Promise.resolve(data.result);
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return Promise.reject(message);
    }
}

const generateAuthHeader = (): string => {
    if (adminAccess.tokenValue) {
        return `Bearer ${adminAccess.tokenValue}`;
    } else if (userAccess.tokenValue) {
        return `Bearer ${userAccess.tokenValue}`;
    }
    return "";
}

const apiClient = { post, get, mDelete, generateAuthHeader, upload, patch };
export default apiClient;

