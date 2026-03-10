"use client";

import { useState, useCallback } from "react";

interface Evaluation {
  fileKey: string;
  email: string;
  projectType: string;
  fileName: string;
  uploadedAt: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [triggerStatus, setTriggerStatus] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const [triggerMessages, setTriggerMessages] = useState<
    Record<string, string>
  >({});

  const fetchEvaluations = useCallback(
    async (token: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/evaluations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error("Wrong password.");
          throw new Error("Failed to load evaluations.");
        }
        const data = await res.json();
        setEvaluations(data);
        setLoggedIn(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvaluations(secret);
  };

  const handleRetrigger = async (fileKey: string) => {
    setTriggerStatus((prev) => ({ ...prev, [fileKey]: "loading" }));
    setTriggerMessages((prev) => ({ ...prev, [fileKey]: "" }));
    try {
      const res = await fetch("/api/retrigger", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTriggerStatus((prev) => ({ ...prev, [fileKey]: "error" }));
        setTriggerMessages((prev) => ({
          ...prev,
          [fileKey]: data.error || "Failed",
        }));
      } else {
        setTriggerStatus((prev) => ({ ...prev, [fileKey]: "success" }));
        setTriggerMessages((prev) => ({
          ...prev,
          [fileKey]: `Sent to ${data.email}`,
        }));
      }
    } catch {
      setTriggerStatus((prev) => ({ ...prev, [fileKey]: "error" }));
      setTriggerMessages((prev) => ({
        ...prev,
        [fileKey]: "Network error",
      }));
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Admin Dashboard
          </h1>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Password
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-dark"
            placeholder="Enter ADMIN_SECRET"
            required
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark text-white rounded-lg py-2 font-medium hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Log in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <button
            onClick={() => fetchEvaluations(secret)}
            disabled={loading}
            className="text-sm bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {evaluations.length === 0 ? (
          <p className="text-gray-500">No evaluations found in storage.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluations.map((ev) => {
                  const status = triggerStatus[ev.fileKey] ?? "idle";
                  const msg = triggerMessages[ev.fileKey] ?? "";
                  return (
                    <tr key={ev.fileKey} className="text-sm">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {ev.uploadedAt !== "unknown"
                          ? new Date(ev.uploadedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {ev.email}
                      </td>
                      <td
                        className="px-4 py-3 text-gray-700 max-w-[200px] truncate"
                        title={ev.fileName}
                      >
                        {ev.fileName}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">
                        {ev.projectType.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3">
                        {status === "success" ? (
                          <span className="text-green-600 font-medium">
                            {msg}
                          </span>
                        ) : status === "error" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 text-xs">
                              {msg}
                            </span>
                            <button
                              onClick={() => handleRetrigger(ev.fileKey)}
                              className="text-xs underline text-gray-600 hover:text-gray-900"
                            >
                              Retry
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRetrigger(ev.fileKey)}
                            disabled={status === "loading"}
                            className="bg-brand-dark text-white text-xs rounded-lg px-3 py-1.5 font-medium hover:bg-brand-700 disabled:opacity-50"
                          >
                            {status === "loading"
                              ? "Running..."
                              : "Retrigger"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
