"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">
            ArkHelix
          </h1>

          <button
            onClick={() => router.push("/upload")}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Upload Save
          </button>
        </header>

        {/* Hero */}
        <section className="mt-28 text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Understand your
            <span className="block text-white/80">
              breeding lines.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60">
            Upload your ARK save file and instantly visualize dinos,
            stats, mutations, and lineage evolution.
            No spreadsheets. No chaos.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => router.push("/upload")}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              Upload Save File
            </button>

            <button
              onClick={() => router.push("/upload")}
              className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
            >
              View Demo
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="mt-28 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10">
            <h3 className="text-sm font-semibold">
              Mutation Tracking
            </h3>
            <p className="mt-2 text-sm text-white/60">
              See maternal & paternal mutation stacks instantly.
            </p>
          </div>

          <div className="rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10">
            <h3 className="text-sm font-semibold">
              Lineage Visualization
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Track bloodlines across generations without losing context.
            </p>
          </div>

          <div className="rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10">
            <h3 className="text-sm font-semibold">
              Snapshot Diff
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Compare uploads and see what changed over time.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-28 text-center text-xs text-white/40">
          © {new Date().getFullYear()} ArkHelix — Built for serious breeders.
        </footer>
      </div>
    </main>
  );
}