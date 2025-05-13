import {
  Document,
  model,
  Schema,
  SchemaTypes,
  type CallbackError,
} from "mongoose";
import type IAdmin from "../../../modules/admin/model/admin";
import { PasswordUtils } from "../../utils/PasswordUtils";

const adminSchema = new Schema<IAdmin>(
  {
    adminId: {
      type: SchemaTypes.String,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: SchemaTypes.String,
      required: true,
      lowercase: true,
    },

    email: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: SchemaTypes.String,
      required: true,
      trim: true,
      minLength: 8,
    },

    role: {
      type: String,
      default: "ADMIN",
    },

    isActive: { type: Boolean, default: false },

    isVerified: { type: Boolean, default: false },

    lastLogin: { type: [Date] },

    isBlocked: { type: Boolean, default: false },

    loginAttempts: { type: Number, default: 0, max: 3 },

    lockUntil: { type: Date },

    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
adminSchema.pre("save", async function (next) {
  const admin = this;

  // Only hash the password if it's new or modified
  if (!admin.isModified("password")) return next();

  try {
    admin.password = await PasswordUtils.hashPassword(admin.password); // Hash the password
    next();
  } catch (error: unknown) {
    next(error as CallbackError);
  }
});

export const adminModel = model("admin", adminSchema);
