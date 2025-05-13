import { adminRepo, adminSessionRepo } from "../../modules/admin/repo";
import { Middleware } from "./middleware";

const middleware = new Middleware(adminSessionRepo, adminRepo);

export { middleware };
