import type { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type IImageRepo from "../repo/IImageRepo";
import type { IImages } from "../model/image";

export class GetAllImagesController extends BaseController {
  private imageRepo: IImageRepo;

  constructor(imageRepo: IImageRepo) {
    super();
    this.imageRepo = imageRepo;
  }
  public async executeImpl(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<any> {
    try {
      const result = await this.imageRepo.getAllImages();

      return this.ok<IImages[]>(res, result);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
