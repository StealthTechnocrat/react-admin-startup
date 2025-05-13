import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { authConfig } from "../../config";
import type {
  JWTClaims,
  JWTToken,
  RefreshToken,
} from "../../modules/admin/model/jwt";

export class JWTUtils {
  // generate a access token for user
  public static signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      adminId: props.adminId,
      email: props.email,
      name: props.name,
    };
    return jwt.sign(claims, authConfig.secret, {
      expiresIn: "30m",
    });
  }

  // decode access token for user
  public static decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
          const errorMessage =
            err.name === "TokenExpiredError"
              ? "TokenExpiredError"
              : err.name === "JsonWebTokenError"
              ? "Invalid token"
              : "Failed to decode token";
          reject(new Error(errorMessage));
        } else {
          resolve(decoded as JWTClaims);
        }
      });
    });
  }

  // generate a unique refresh token
  public static generateRefreshToken(): RefreshToken {
    return uuidv4();
  }
}
