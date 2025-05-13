import random from "random";

export class Utility {
  public static generateFourDigitCode(): string {
    const rand = random.int(0, 9999);
    return rand.toString().padStart(4, "0");
  }
}
