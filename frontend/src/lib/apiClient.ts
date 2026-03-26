import { getStoredSession } from "../context/authSession";

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "https://devboard-4dco.onrender.com/api";

export interface ApiClientOptions {
	method?: string;
	headers?: Record<string, string>;
	body?: unknown;
	token?: string;
	signal?: AbortSignal;
}

export class ApiError extends Error {
	status: number;
	data?: unknown;

	constructor(message: string, status: number, data?: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
}

export async function apiClient<T>(
	endpoint: string,
	{ method = "GET", headers = {}, body, token, signal }: ApiClientOptions = {}
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const fetchHeaders: Record<string, string> = {
		"Content-Type": "application/json",
		...headers,
	};

	if (token) {
		fetchHeaders["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		method,
		headers: fetchHeaders,
		body: body ? JSON.stringify(body) : undefined,
		signal,
	});

	let data: unknown = null;

	try {
		data = await response.json();
	} catch {
		data = null;
	}

	if (!response.ok) {
		const errorMessage =
			(data as { message?: string; error?: string } | null)?.message ||
			(data as { message?: string; error?: string } | null)?.error ||
			response.statusText ||
			"Something went wrong";

		throw new ApiError(errorMessage, response.status, data);
	}

	return data as T;
}



export async function authApiClient<T>(
	endpoint: string,
	options: Omit<ApiClientOptions, "token"> = {}
): Promise<T> {
	const session = getStoredSession()
const token = session?.accessToken
	if (!token) {
		throw new ApiError("No authentication token found", 401);
	}	
	return apiClient<T>(endpoint, { ...options, token });
}