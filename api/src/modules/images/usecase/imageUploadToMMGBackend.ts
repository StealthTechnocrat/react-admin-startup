import type { MultipartFile } from "@fastify/multipart";
import { AppError } from "../../../shared/core/appError";
import { left, Result, right, type Either } from "../../../shared/core/result";
import type { UseCase } from "../../../shared/core/usecase";
import { axiosservice } from "../../../shared/service";
import fs from "fs";
import path from "path";
import FormData from "form-data";

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>;

interface IUseCaseRequest {
  gameId: string;
  imagePath: string;
  folderName: string;
}

export class ImageUploadToMMGBackend
  implements UseCase<IUseCaseRequest, Response>
{
  public async execute(request: IUseCaseRequest): Promise<Response> {
    try {
      const { imagePath, folderName, gameId } = request;
      const baseUrl = process.env["MMG_Base_API_URL"];
      if (!baseUrl) {
        throw new Error(
          "Base API URL is not defined in environment variables."
        );
      }

      // Prepare FormData
      const url = path.join(`${__dirname}../../../../../${imagePath}`);

      const fileStream = fs.createReadStream(url);

      const formData = new FormData();
      formData.append("id", gameId);
      formData.append("file", fileStream);

      // formData.append("folderName", folderName);

      await axiosservice.post(
        `${baseUrl}/games/updateGamesThumnail`,
        formData,
        {},
        { "Content-Type": "multipart/form-data" }
      );

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}
