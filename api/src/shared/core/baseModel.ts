import { Result } from "./result";
import { z, ZodType, ZodSchema } from "zod";

export abstract class BaseModel {
  /**
   * Dynamically create a Zod schema based on the provided interface structure.
   */
  public static createSchema<T extends Record<string, any>>(
    modelDefinition: T
  ): ZodSchema {
    const schemaDefinition: Record<string, ZodType<any>> = {};

    for (const key in modelDefinition) {
      const value = modelDefinition[key];
      if (typeof value === "string") {
        schemaDefinition[key] = z.string();
      } else if (typeof value === "number") {
        schemaDefinition[key] = z.number();
      } else if (typeof value === "boolean") {
        schemaDefinition[key] = z.boolean();
      } else if (Array.isArray(value)) {
        schemaDefinition[key] = z.array(z.any());
      } else if (typeof value === "object") {
        schemaDefinition[key] = z.object({});
      } else {
        schemaDefinition[key] = z.any();
      }
    }

    return z.object(schemaDefinition);
  }

  public static create<U>(value: U): Result<U> {
    try {
      const result = value as unknown as U;
      return Result.ok<U>(result);
    } catch (error) {
      return Result.fail<U>(
        `Failed to create the model: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
