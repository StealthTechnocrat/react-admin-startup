import { adminRepo } from "../../admin/repo";
import { CreateDefaultSuperAdmin } from "./createDefaultSuperAdmin";

const createDefaultSuperAdmin = new CreateDefaultSuperAdmin(adminRepo);

export { createDefaultSuperAdmin };
