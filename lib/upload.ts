"use server";

import {
  PutObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import path from "path";

async function getS3Client() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT; // For S3-compatible storage (DigitalOcean, MinIO, etc.)

  if (!region) {
    throw new Error("AWS_REGION is not configured");
  }

  if (!accessKeyId) {
    throw new Error("AWS_ACCESS_KEY_ID is not configured");
  }

  if (!secretAccessKey) {
    throw new Error("AWS_SECRET_ACCESS_KEY is not configured");
  }

  if (!endpoint) {
    throw new Error("S3_ENDPOINT is not configured");
  }

  return new S3Client({
    region,
    endpoint: endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
}

/**
 * Checks if a file already exists in the S3 bucket.
 */
export async function fileExistsInS3(key: string): Promise<boolean> {
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

  try {
    if (!S3_BUCKET_NAME) {
      throw new Error("S3_BUCKET_NAME is not configured");
    }

    const command = new HeadObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    const s3Client = await getS3Client();

    await s3Client.send(command);

    return true;
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }

    throw error;
  }
}

/**
 * Gets the content type based on the file extension.
 */
function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

/**
 * Uploads a file buffer to a specific folder in the S3 bucket.
 * @param formData The form data containing the file
 * @param fileName The name of the file
 * @param folder The destination folder in the bucket (e.g., "product", "banners")
 * @param force If true, overwrites the file if it already exists
 */
export async function uploadToS3(
  formData: FormData,
  fileName: string,
  folder: string,
  force: boolean = false,
) {
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

  try {
    if (!S3_BUCKET_NAME) {
      throw new Error("S3_BUCKET_NAME is not configured");
    }

    const s3Key = folder ? `${folder}/${fileName}` : fileName;

    const endpoint = process.env.S3_ENDPOINT;

    const url = `${endpoint}/${S3_BUCKET_NAME}/${s3Key}`;

    // Check if file already exists to save bandwidth
    if (!force && (await fileExistsInS3(s3Key))) {
      return { message: "Файл уже существует в S3, пропуск загрузки", url };
    }

    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: getContentType(fileName),
    });

    const s3Client = await getS3Client();

    await s3Client.send(command);

    return { url, message: "Файл успешно загружен в S3" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Ошибка при загрузке файла");
  }
}

/**
 * Uploads a file buffer to a specific folder in the S3 bucket.
 * @param fileBuffer The file content as a Buffer
 * @param fileName The name of the file
 * @param folder The destination folder in the bucket (e.g., "product", "banners")
 * @param force If true, overwrites the file if it already exists
 */
export async function uploadToS3WithBuffer(
  fileBuffer: Buffer,
  fileName: string,
  folder: string,
  force: boolean = false,
) {
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

  try {
    if (!S3_BUCKET_NAME) {
      throw new Error("S3_BUCKET_NAME is not configured");
    }

    const s3Key = folder ? `${folder}/${fileName}` : fileName;

    const endpoint = process.env.S3_ENDPOINT;

    const url = `${endpoint}/${S3_BUCKET_NAME}/${s3Key}`;

    // Check if file already exists to save bandwidth
    if (!force && (await fileExistsInS3(s3Key))) {
      return { message: "Файл уже существует в S3, пропуск загрузки", url };
    }

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: getContentType(fileName),
    });

    const s3Client = await getS3Client();

    await s3Client.send(command);

    return { url, message: "Файл успешно загружен в S3" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Ошибка при загрузке файла");
  }
}
