import { AppError } from "../../../shared/core/appError";
import { left, Result, right, type Either } from "../../../shared/core/result";
import type { UseCase } from "../../../shared/core/usecase";
import sharp from "sharp";
import path from "path";
import { promises as fsPromises } from "fs";
import type { MultipartFile } from "@fastify/multipart";

type Response = Either<AppError.UnexpectedError | Result<any>, Result<string>>;

interface IUseCaseRequest {
  file: MultipartFile;
  folderName: string;
}

export class UploadImageUseCase implements UseCase<IUseCaseRequest, Response> {
  public async execute(request: IUseCaseRequest): Promise<Response> {
    try {
      const { file, folderName } = request;

      if (!file) {
        return left(Result.fail("No file uploaded")) as Response;
      }

      if (!file.mimetype.startsWith("image/")) {
        return left(
          Result.fail("Invalid file type. Only images are allowed.")
        ) as Response;
      }

      // Sanitize folder name (prevent invalid characters)
      const sanitizedFolder = folderName.replace(/[^a-zA-Z0-9_-]/g, "");

      // Ensure upload directory exists
      const uploadDir = path.join("assets", sanitizedFolder);
      await fsPromises.mkdir(uploadDir, { recursive: true });

      const fileExt = path.extname(file.filename) || ".webp"; // Default to `.webp`

      const webpFilename = `${file.filename.replace(/\.[^/.]+$/, "")}.webp`;
      const webpUploadPath = path.join(uploadDir, webpFilename);

      // Convert the image to WebP format
      await sharp(await file.toBuffer())
        .resize(300, 300, { fit: "cover" }) // Resize to 300x300
        .webp({ quality: 80 }) // Convert to WebP with 80% quality
        .toFile(webpUploadPath);

      // Construct the public URL
      const previewUrl = `/assets/${sanitizedFolder}/${webpFilename}`;

      return right(Result.ok<string>(previewUrl));
    } catch (error) {
      console.error("Upload error:", error);
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}
