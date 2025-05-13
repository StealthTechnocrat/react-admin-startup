import type {
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";
import { appLogger } from "../utils/logger";
import { JWTUtils } from "../utils/JWTUtils";
import type { IAdminSessionRepo } from "../../modules/admin/repo/IAdminSessionRepo";
import type DecodedFastifyRequest from "../../modules/admin/infra/DecodedRequest";
import type { IAdminRepo } from "../../modules/admin/repo/IAdminRepo";

export class Middleware {
  private adminSessionRepo: IAdminSessionRepo;
  private adminRepo: IAdminRepo;

  constructor(adminSessionRepo: IAdminSessionRepo, adminRepo: IAdminRepo) {
    this.adminSessionRepo = adminSessionRepo;
    this.adminRepo = adminRepo;
  }

  private endRequest(
    status: 400 | 401 | 403,
    message: string,
    res: FastifyReply
  ): void {
    res.status(status).send({ message });
  }

  public ensureAuthenticated(): preHandlerHookHandler {
    return async (req: FastifyRequest, res: FastifyReply) => {
      let token = req.cookies["accessToken"];

      if (token) {
        try {
          const decoded = await JWTUtils.decodeJWT(token);

          const { adminId } = decoded;
          // Check if the admin session exists
          await this.adminSessionRepo.getAdminSessionByAdminId(adminId);
          // Attach decoded token to the request
          (req as any).decoded = decoded;
          return;
        } catch (err) {
          if (err instanceof Error) {
            if (err.message.toString() === "TokenExpiredError")
              return this.endRequest(401, "Token signature expired.", res);
          }
          return this.endRequest(
            403,
            "Auth token not found. Admin is probably not logged in. Please login again.",
            res
          );
        }
      }

      return this.endRequest(403, "Please Login", res);
    };
  }

  public includeDecodedTokenIfExists() {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      let token = req.headers["authorization"];

      if (token && token.startsWith("Bearer ")) {
        token = token.slice(7); // Remove "Bearer " from the token
      }

      if (token) {
        const decoded = await JWTUtils.decodeJWT(token);
        if (!decoded) {
          return this.endRequest(401, "Token signature expired.", reply);
        }

        const { adminId } = decoded;

        try {
          await this.adminSessionRepo.getAdminSessionByAdminId(adminId);
          // Attach the decoded token to the request for further use
          (req as any).decoded = decoded;
        } catch (err) {
          appLogger.error(err);
          return this.endRequest(
            403,
            "Auth token not found. Admin is probably not logged in. Please login again.",
            reply
          );
        }
      }

      // If no token, continue with the request
    };
  }

  public ensureAuthorization(
    checkRole: "SUPERADMIN" | "ADMIN" | "AGENT" | "INFLUENCER"
  ): preHandlerHookHandler {
    return async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const decodedReq = req as DecodedFastifyRequest;
        if (!decodedReq.decoded) {
          return this.endRequest(403, "Unauthorized request", res);
        }

        const { adminId } = decodedReq.decoded;

        const existOrNot = await this.adminRepo.exists(adminId);
        if (!existOrNot) {
          return this.endRequest(400, "Not Found Admin", res);
        }

        const admin = await this.adminRepo.getAdminbyAdminId(adminId);

        if (admin.role !== checkRole) {
          throw new Error("Authorization Failed");
        }
      } catch (err) {
        return this.endRequest(
          400,
          err instanceof Error ? err.message : "Authorization Failed",
          res
        );
      }
    };
  }
}

// import type {
//   FastifyReply,
//   FastifyRequest,
//   preHandlerHookHandler,
// } from "fastify";
// import { appLogger } from "../utils/logger";
// import { JWTUtils } from "../utils/JWTUtils";
// import type { IAdminSessionRepo } from "../../modules/admin/repo/IAdminSessionRepo";
// import type { ACTIONTYPE, MODULETYPE } from "../../modules/admin/model/role";
// import type { IAdminRepo } from "../../modules/admin/repo/IAdminRepo";
// import type { IRoleRepo } from "../../modules/admin/repo/IRoleRepo";
// import type DecodedFastifyRequest from "../../modules/admin/infra/DecodedRequest";

// export class Middleware {
//   private adminRepo: IAdminRepo;
//   private adminSessionRepo: IAdminSessionRepo;
//   private roleRepo: IRoleRepo;

//   constructor(
//     adminRepo: IAdminRepo,
//     adminSessionRepo: IAdminSessionRepo,
//     roleRepo: IRoleRepo
//   ) {
//     this.adminRepo = adminRepo;
//     this.adminSessionRepo = adminSessionRepo;
//     this.roleRepo = roleRepo;
//   }

//   private endRequest(
//     status: 400 | 401 | 403,
//     message: string,
//     res: FastifyReply
//   ): void {
//     res.status(status).send({ message });
//   }

//   public ensureAuthenticated(): preHandlerHookHandler {
//     return async (req: FastifyRequest, res: FastifyReply) => {
//       let token = req.cookies["accessToken"];

//       if (token) {
//         try {
//           const decoded = await JWTUtils.decodeJWT(token);
//           const { adminId } = decoded;

//           await this.adminSessionRepo.getAdminSessionByAdminId(adminId);
//           (req as any).decoded = decoded;
//           return;
//         } catch (err) {
//           if (err instanceof Error && err.message === "jwt expired") {
//             return this.endRequest(401, "Token signature expired.", res);
//           }
//           return this.endRequest(
//             403,
//             "Auth token not found. Please login.",
//             res
//           );
//         }
//       }

//       return this.endRequest(403, "Please Login", res);
//     };
//   }

//   public includeDecodedTokenIfExists() {
//     return async (req: FastifyRequest, reply: FastifyReply) => {
//       let token = req.headers["authorization"];

//       if (token && token.startsWith("Bearer ")) {
//         token = token.slice(7); // Remove "Bearer " from the token
//       }

//       if (token) {
//         const decoded = await JWTUtils.decodeJWT(token);
//         if (!decoded) {
//           return this.endRequest(401, "Token signature expired.", reply);
//         }

//         const { adminId } = decoded;

//         try {
//           await this.adminSessionRepo.getAdminSessionByAdminId(adminId);
//           // Attach the decoded token to the request for further use
//           (req as any).decoded = decoded;
//         } catch (err) {
//           appLogger.error(err);
//           return this.endRequest(
//             403,
//             "Auth token not found. Admin is probably not logged in. Please login again.",
//             reply
//           );
//         }
//       }

//       // If no token, continue with the request
//     };
//   }

//   public ensureAuthorization(
//     moduleAccess: MODULETYPE,
//     action: ACTIONTYPE
//   ): preHandlerHookHandler {
//     return async (req: FastifyRequest, res: FastifyReply) => {
//       try {
//         const decodedReq = req as DecodedFastifyRequest;
//         if (!decodedReq.decoded) {
//           return this.endRequest(403, "Unauthorized request", res);
//         }

//         const { adminId } = decodedReq.decoded;

//         const existOrNot = await this.adminRepo.exists(adminId);
//         if (!existOrNot) {
//           return this.endRequest(400, "Not Found Admin", res);
//         }

//         const admin = await this.adminRepo.getAdminbyAdminId(adminId);

//         const hasPermission = await this.roleRepo.checkRoleAndHisPermission(
//           admin.role,
//           moduleAccess,
//           action
//         );

//         if (!hasPermission) {
//           throw new Error("Authorization Failed");
//         }
//       } catch (err) {
//         return this.endRequest(
//           400,
//           err instanceof Error ? err.message : "Authorization Failed",
//           res
//         );
//       }
//     };
//   }
// }
