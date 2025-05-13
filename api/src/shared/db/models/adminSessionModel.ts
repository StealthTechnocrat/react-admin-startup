import mongoose from "mongoose";
import type IAdminSession from "../../../modules/admin/model/adminSession";

const adminSessionSchema = new mongoose.Schema<IAdminSession>(
  {
    adminSessionId: { type: String, required: true, index: true, unique: true },
    adminId: { type: String, required: true },
    token: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    expiryDate: { type: Date, required: true },
    reply: { type: String },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
  }
);

adminSessionSchema.virtual("isExpired").get(function () {
  return this.expiryDate < new Date();
});

export const adminSessionModel = mongoose.model(
  "adminSession",
  adminSessionSchema
);
