import type { FastifyReply } from "fastify";
import { isProduction } from "../../config";
import type { JWTToken } from "../../modules/admin/model/jwt";

export class CookiesUtils {
  public static accessTokenName = "accessToken";

  /**
   * Sets the access token in the HTTP-only cookie.
   * @param reply - Fastify reply object.
   * @param token - JWT access token.
   */
  public static setAccessTokenInCookie(
    reply: FastifyReply,
    token: JWTToken
  ): void {
    reply.setCookie(this.accessTokenName, token, {
      httpOnly: false,
      secure: true, // Use secure cookies in production.
      sameSite: "none",
      // Adjust domain for production.
      path: "/", // Token is accessible for all routes.
    });
  }

  /**domain: isProduction ? "" : "localhost",
   * Clears the access token from the HTTP-only cookie.
   * @param reply - Fastify reply object.
   */
  public static clearAccessTokenFromCookie(reply: FastifyReply): void {
    reply.clearCookie(this.accessTokenName, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      // domain: isProduction ? "" : "localhost", // Adjust domain for production.
      path: "/", // Token is accessible for all routes.
    });
  }
}
