"use client";

import React, { useMemo, useRef, useState } from "react";

type UploadState = "idle" | "ready" | "uploading" | "done" | "error";

const MAX_MB = 200; // adjust
const ACCEPT_EXT = [".ark", ".arkprofile", ".arktribe", ".sav", ".zip"]; // tweak as needed

function humanSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [msg, setMsg] = useState<string>("");
  const [serverId, setServerId] = useState<string>("");

  const acceptAttr = useMemo(
    () => ACCEPT_EXT.join(","),
    []
  );

  function validate(f: File) {
    const lower = f.name.toLowerCase();

    const okExt = ACCEPT_EXT.some((ext) => lower.endsWith(ext));
    if (!okExt) {
      return `Invalid file type. Allowed: ${ACCEPT_EXT.join(", ")}`;
    }

    const maxBytes = MAX_MB * 1024 * 1024;
    if (f.size > maxBytes) {
      return `File too large. Max ${MAX_MB} MB (yours: ${humanSize(f.size)}).`;
    }

    return "";
  }

  function setPickedFile(f: File | null) {
    if (!f) {
      setFile(null);
      setState("idle");
      setMsg("");
      setServerId("");
      return;
    }

    const err = validate(f);
    if (err) {
      setFile(null);
      setState("error");
      setMsg(err);
      setServerId("");
      return;
    }

    setFile(f);
    setState("ready");
    setMsg("");
    setServerId("");
  }

  async function onUpload() {
    if (!file || state === "uploading") return;

    setState("uploading");
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      // Optional metadata fields:
      fd.append("source", "arkhelix-upload");
      // fd.append("notes", "my upload");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || `Upload failed (${res.status})`);
      }

      setState("done");
      setServerId(data?.id || "");
      setMsg("Upload complete. Next: parse + visualize 🔥");
    } catch (e: any) {
      setState("error");
      setMsg(e?.message || "Upload failed.");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            ArkHelix • Save Import
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Upload your ARK save file
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Drop a <span className="text-white/90">.ark</span>,{" "}
            <span className="text-white/90">.arkprofile</span>,{" "}
            <span className="text-white/90">.arktribe</span>,{" "}
            <span className="text-white/90">.sav</span> or{" "}
            <span className="text-white/90">.zip</span>. We’ll parse it and build
            your breeding / mutation dashboard.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);

            const f = e.dataTransfer.files?.[0] || null;
            setPickedFile(f);
          }}
          className={[
            "rounded-2xl p-6 ring-1 transition",
            dragOver
              ? "bg-white/[0.06] ring-white/25"
              : "bg-white/[0.03] ring-white/10 hover:bg-white/[0.05]",
          ].join(" ")}
        >
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-white/80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 16V4" />
                <path d="M7 9l5-5 5 5" />
                <path d="M20 16v4H4v-4" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium">
                Drag & drop your file here
              </p>
              <p className="mt-1 text-xs text-white/60">
                or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="font-medium text-white/90 underline underline-offset-4 hover:text-white"
                >
                  browse
                </button>{" "}
                (max {MAX_MB}MB)
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={acceptAttr}
              className="hidden"
              onChange={(e) => setPickedFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* Selected file card */}
          {file && (
            <div className="mt-6 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="mt-1 text-xs text-white/60">
                    {humanSize(file.size)} • {file.type || "unknown type"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPickedFile(null)}
                    className="rounded-xl bg-white/5 px-3 py-2 text-xs font-medium ring-1 ring-white/10 hover:bg-white/10"
                    disabled={state === "uploading"}
                  >
                    Remove
                  </button>

                  <button
                    type="button"
                    onClick={onUpload}
                    disabled={state !== "ready"}
                    className={[
                      "rounded-xl px-4 py-2 text-xs font-semibold transition ring-1",
                      state === "ready"
                        ? "bg-white text-black ring-white/20 hover:bg-gray-200"
                        : "bg-white/10 text-white/40 ring-white/10 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {state === "uploading" ? "Uploading…" : "Upload"}
                  </button>
                </div>
              </div>

              {/* Fake progress bar vibe (optional) */}
              {state === "uploading" && (
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-white/40" />
                </div>
              )}
            </div>
          )}

          {/* Status */}
          {msg && (
            <div
              className={[
                "mt-4 rounded-2xl p-4 text-sm ring-1",
                state === "error"
                  ? "bg-red-500/10 text-red-200 ring-red-500/20"
                  : "bg-emerald-500/10 text-emerald-100 ring-emerald-500/20",
              ].join(" ")}
            >
              <p>{msg}</p>
              {serverId && (
                <p className="mt-2 text-xs opacity-80">
                  Upload ID: <span className="font-mono">{serverId}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Next steps hint */}
        <div className="mt-10 rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10">
          <h2 className="text-sm font-semibold">Next steps</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
            <li>Parse save → extract dinos, stats, mutations.</li>
            <li>Store snapshot → show “breeding lines” dashboard.</li>
            <li>Diff uploads → “what changed since last time?”</li>
          </ul>
        </div>
      </div>
    </main>
  );
}