import { randomUUID } from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import type { ProjectType } from "./claude";

interface PendingMetadata {
  email: string;
  projectType: ProjectType;
  fileName: string;
}

const BUCKET = "easyapplications";

function getR2() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function storePending(
  data: { email: string; projectType: ProjectType; buffer: Buffer; fileName: string }
): Promise<string> {
  const key = randomUUID();
  const r2 = getR2();

  const metadata: PendingMetadata = {
    email: data.email,
    projectType: data.projectType,
    fileName: data.fileName,
  };

  // Upload metadata manifest and file in parallel
  await Promise.all([
    r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `pending/${key}/metadata.json`,
        Body: JSON.stringify(metadata),
        ContentType: "application/json",
      })
    ),
    r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `pending/${key}/${data.fileName}`,
        Body: data.buffer,
        ContentType: "application/octet-stream",
      })
    ),
  ]);

  return key;
}

export async function retrievePending(
  key: string
): Promise<{ email: string; projectType: ProjectType; buffer: Buffer; fileName: string } | null> {
  const r2 = getR2();

  try {
    // First get the metadata to know the file name
    const manifestRes = await r2.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: `pending/${key}/metadata.json`,
      })
    );
    const metadata: PendingMetadata = JSON.parse(
      await manifestRes.Body!.transformToString()
    );

    // Then download the actual file
    const fileRes = await r2.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: `pending/${key}/${metadata.fileName}`,
      })
    );
    const bytes = await fileRes.Body!.transformToByteArray();

    return {
      email: metadata.email,
      projectType: metadata.projectType as ProjectType,
      buffer: Buffer.from(bytes),
      fileName: metadata.fileName,
    };
  } catch {
    return null;
  }
}

export interface PendingEntry {
  fileKey: string;
  email: string;
  projectType: string;
  fileName: string;
  uploadedAt: string;
}

export async function listPending(): Promise<PendingEntry[]> {
  const r2 = getR2();

  const res = await r2.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: "pending/",
      Delimiter: "/",
    })
  );

  const prefixes = res.CommonPrefixes?.map((p) => p.Prefix!) ?? [];
  // Extract keys like "pending/uuid/" → "uuid"
  const keys = prefixes.map((p) => p.replace("pending/", "").replace("/", ""));

  const entries: PendingEntry[] = [];

  for (const key of keys) {
    try {
      const metaRes = await r2.send(
        new GetObjectCommand({
          Bucket: BUCKET,
          Key: `pending/${key}/metadata.json`,
        })
      );
      const metadata: PendingMetadata = JSON.parse(
        await metaRes.Body!.transformToString()
      );
      entries.push({
        fileKey: key,
        email: metadata.email,
        projectType: metadata.projectType,
        fileName: metadata.fileName,
        uploadedAt: metaRes.LastModified?.toISOString() ?? "unknown",
      });
    } catch {
      // Skip broken entries
    }
  }

  // Sort newest first
  entries.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  return entries;
}
