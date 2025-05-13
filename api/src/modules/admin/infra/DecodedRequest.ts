import type { RouteGenericInterface, FastifyRequest } from "fastify";
import type { JWTClaims } from "../model/jwt";

export default interface DecodedFastifyRequest<
  T extends RouteGenericInterface = {}
> extends FastifyRequest<T> {
  decoded: JWTClaims;
}
