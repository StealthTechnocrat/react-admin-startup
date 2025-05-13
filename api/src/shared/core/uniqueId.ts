import { v4 as uuid } from "uuid";

export class UniqueID {
  private readonly id: string;

  constructor(id?: string) {
    // If an id is provided, use it; otherwise, generate a new UUID.
    this.id = id || uuid();
  }

  public static create(id?: string): UniqueID {
    return new UniqueID(id); // Return the instance of UniqueID
  }

  public getId(): string {
    return this.id; // Get the value of the ID
  }
}
