import { adminModel } from "../../../shared/db/models/adminModel";
import { adminSessionModel } from "../../../shared/db/models/adminSessionModel";
import { AdminRepo } from "./implemation/adminRepo";
import { AdminSessionRepo } from "./implemation/adminSessionRepo";

const adminRepo = new AdminRepo(adminModel);
const adminSessionRepo = new AdminSessionRepo(adminSessionModel);

export { adminRepo, adminSessionRepo };
