import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Helper: upload buffer to Cloudinary
function streamUpload(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "recipes" }, // optional: alle Bilder in einem Unterordner speichern
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url); // die URL zurückgeben
      }
    );

    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Buffer aus dem File erstellen
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload zu Cloudinary
    const secure_url = await streamUpload(buffer);

    return NextResponse.json({ secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}