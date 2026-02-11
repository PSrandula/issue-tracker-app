import axios from "axios";
import type { InternalAxiosRequestConfig, RawAxiosResponseHeaders } from "axios";
import {
  MOCK_TOKEN,
  findIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  queryIssues,
} from "./mockData";


const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") !== "false";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT on every request (works for both mock & real)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Mock interceptor ─────────────────────────
if (USE_MOCK) {
  const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

  api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    await delay(250 + Math.random() * 200); // simulate network

    const url = config.url || "";
    const method = (config.method || "get").toLowerCase();
    const body =
      typeof config.data === "string" ? JSON.parse(config.data) : config.data;

    let responseData: unknown = null;
    let status = 200;

    // ── AUTH ──
    if (url.includes("/auth/login") && method === "post") {
      responseData = { token: MOCK_TOKEN };
    } else if (url.includes("/auth/register") && method === "post") {
      responseData = { message: "Registered successfully" };
      status = 201;
    }

    // ── ISSUES LIST ──
    else if (url.match(/\/issues\/?$/) && method === "get") {
      const params = config.params || {};
      responseData = queryIssues({
        search: params.search,
        status: params.status,
        priority: params.priority,
        page: Number(params.page) || 1,
      });
    }

    // ── CREATE ISSUE ──
    else if (url.match(/\/issues\/?$/) && method === "post") {
      responseData = createIssue(body);
      status = 201;
    }

    // ── PATCH STATUS ──
    else if (url.match(/\/issues\/[\w-]+\/status/) && method === "patch") {
      const id = url.split("/issues/")[1].split("/")[0];
      responseData = updateIssue(id, { status: body.status });
    }

    // ── UPDATE ISSUE ──
    else if (url.match(/\/issues\/[\w-]+$/) && method === "put") {
      const id = url.split("/issues/")[1];
      responseData = updateIssue(id, body);
    }

    // ── DELETE ISSUE ──
    else if (url.match(/\/issues\/[\w-]+$/) && method === "delete") {
      const id = url.split("/issues/")[1];
      deleteIssue(id);
      responseData = { message: "Deleted" };
    }

    // ── GET SINGLE ISSUE ──
    else if (url.match(/\/issues\/[\w-]+$/) && method === "get") {
      const id = url.split("/issues/")[1];
      const issue = findIssue(id);
      if (!issue) {
        const err = new axios.AxiosError(
          "Not found",
          "404",
          config as InternalAxiosRequestConfig,
          null,
          {
            status: 404,
            statusText: "Not Found",
            headers: {} as RawAxiosResponseHeaders,
            config: config as InternalAxiosRequestConfig,
            data: { message: "Issue not found" },
          }
        );
        return Promise.reject(err);
      }
      responseData = issue;
    }

    // Build a fake adapter that returns our data directly
    config.adapter = () =>
      Promise.resolve({
        data: responseData,
        status,
        statusText: "OK",
        headers: {},
        config,
      });

    return config;
  });

  console.log(
    "%c🔶 MOCK MODE — running without backend. Set VITE_USE_MOCK=false in .env to use real API.",
    "color: #f59e0b; font-weight: bold;"
  );
}

export default api;
