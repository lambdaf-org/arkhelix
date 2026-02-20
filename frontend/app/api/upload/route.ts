import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

export const runtime = "nodejs"; // important for fs

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Basic limits (mirror your frontend limits)
    const maxBytes = 200 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: "File too large." },
        { status: 413 }
      );
    }

    const id = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const outPath = path.join(UPLOAD_DIR, `${id}__${safeName}`);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(outPath, buf);

    return NextResponse.json({
      ok: true,
      id,
      filename: safeName,
      bytes: file.size,
      storedAt: outPath,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Upload failed." },
      { status: 500 }
    );
  }
}