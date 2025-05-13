import type { FastifyReply } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type IImageRepo from "../repo/IImageRepo";
import type DecodedFastifyRequest from "../../admin/infra/DecodedRequest";

export class ImageUploaderController extends BaseController {
  constructor(imageRepo: IImageRepo) {
    super();
  }

  public async executeImpl(
    req: DecodedFastifyRequest,
    res: FastifyReply
  ): Promise<any> {
    try {
      const data = await req.file();

      const { name } = req.decoded;

      return this.ok<void>(res);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
