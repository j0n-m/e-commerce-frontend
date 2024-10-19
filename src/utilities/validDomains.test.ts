import { describe, expect, it } from "vitest";
import validDomains from "./validDomains";

describe("Determines if domain is invalid", () => {
  it("should return undefined for invalid domains", () => {
    const domain = "idk".toUpperCase();
    const value = validDomains.get(domain);
    expect(value).toBe(undefined);
  });
  it("should return undefined for non uppercase domain names", () => {
    const domain = "edu";
    const value = validDomains.get(domain);
    expect(value).toBe(undefined);
  });
});
describe("Determines if domain is valid", () => {
  it("should return the value of a valid domain", () => {
    const domain = "com".toUpperCase();
    const value = validDomains.get(domain);
    expect(value).toBe("COM");
  });
});
