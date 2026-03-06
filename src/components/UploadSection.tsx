"use client";

import { useState, useRef, useCallback } from "react";

type FormStatus = "idle" | "uploading" | "success" | "error";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type ProjectType = "youth_exchange" | "training_course" | "";

export default function UploadSection() {
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(f.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
      return "Only PDF and DOC/DOCX files are accepted.";
    }
    if (f.size > MAX_FILE_SIZE) {
      return "File must be under 10MB.";
    }
    return null;
  };

  const handleFile = (f: File) => {
    const error = validateFile(f);
    if (error) {
      setErrorMessage(error);
      setStatus("error");
      return;
    }
    setFile(f);
    setErrorMessage("");
    if (status === "error") setStatus("idle");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !file || !projectType) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("projectType", projectType);
      formData.append("file", file);

      const res = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      });

      if (res.status === 202) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-3">Application Submitted!</h3>
        <p className="text-green-700 mb-2">
          Your application is being evaluated by our AI.
        </p>
        <p className="text-green-600 text-sm">
          You&apos;ll receive a detailed PDF evaluation report at{" "}
          <strong>{email}</strong> within approximately 10 minutes.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setFile(null);
            setEmail("");
            setProjectType("");
          }}
          className="mt-6 text-sm text-green-700 underline hover:text-green-900"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
      {/* Email field */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
        />
        <p className="text-xs text-gray-400 mt-1.5">
          We&apos;ll send your evaluation report to this email address.
        </p>
      </div>

      {/* Project type selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setProjectType("youth_exchange")}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              projectType === "youth_exchange"
                ? "border-brand-dark bg-brand-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className={`text-sm font-medium ${projectType === "youth_exchange" ? "text-brand-dark" : "text-gray-900"}`}>
              Youth Exchange
            </p>
          </button>
          <button
            type="button"
            onClick={() => setProjectType("training_course")}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              projectType === "training_course"
                ? "border-brand-dark bg-brand-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className={`text-sm font-medium ${projectType === "training_course" ? "text-brand-dark" : "text-gray-900"}`}>
              Training Course
            </p>
          </button>
        </div>
      </div>

      {/* File upload area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Document
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-brand-dark bg-brand-50"
              : file
              ? "border-green-300 bg-green-50"
              : "border-gray-200 hover:border-brand-dark/50 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) handleFile(selected);
            }}
            className="hidden"
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-brand-dark">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">PDF, DOC, or DOCX (max 10MB)</p>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {status === "error" && errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!email || !projectType || !file || status === "uploading"}
        className="w-full py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: "linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%)",
        }}
      >
        {status === "uploading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </span>
        ) : (
          "Evaluate My Application"
        )}
      </button>
    </form>
  );
}
