import * as fastify from "fastify";

export abstract class BaseController {
  protected abstract executeImpl(
    req: fastify.FastifyRequest,
    res: fastify.FastifyReply
  ): Promise<void | any>;

  public async execute(
    req: fastify.FastifyRequest,
    res: fastify.FastifyReply
  ): Promise<void> {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      this.fail(res, "An unexpected error occurred");
    }
  }

  public static jsonResponse(
    res: fastify.FastifyReply,
    code: number,
    message: string
  ) {
    return res.status(code).send({ message });
  }

  public ok<T>(res: fastify.FastifyReply, dto?: T) {
    if (!!dto) {
      res.type("application/json");
      return res.status(200).send(dto);
    } else {
      return res.status(200).send();
    }
  }

  public created(res: fastify.FastifyReply) {
    return res.status(201).send();
  }

  public clientError(res: fastify.FastifyReply, message?: string) {
    return BaseController.jsonResponse(
      res,
      400,
      message ? message : "Unauthorized"
    );
  }

  public unauthorized(res: fastify.FastifyReply, message?: string) {
    return BaseController.jsonResponse(
      res,
      401,
      message ? message : "Unauthorized"
    );
  }

  public paymentRequired(res: fastify.FastifyReply, message?: string) {
    return BaseController.jsonResponse(
      res,
      402,
      message ? message : "Payment required"
    );
  }

  public forbidden(res: fastify.FastifyReply, message?: string) {
    return BaseController.jsonResponse(
      res,
      403,
      message ? message : "Forbidden"
    );
  }

  public notFound(res: fastify.FastifyReply, message?: string) {
    return BaseController.jsonResponse(
      res,
      404,
      message ? message : "Not found"
    );
  }

  public conflict(res: fastify.FastifyReply, message?: string) {
    return BaseController.jsonResponse(
      res,
      409,
      message ? message : "Conflict"
    );
  }

  public tooMany(res: fastify.FastifyReply, message?: string) {
    return BaseController.jsonResponse(
      res,
      429,
      message ? message : "Too many FastifyRequests"
    );
  }

  public todo(res: fastify.FastifyReply) {
    return BaseController.jsonResponse(res, 400, "TODO");
  }

  public fail(res: fastify.FastifyReply, error: Error | string) {
    return res.status(500).send({
      message: error.toString(),
    });
  }
}
