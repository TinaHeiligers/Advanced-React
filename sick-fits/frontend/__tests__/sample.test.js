// globals: describe, test or it, expect
describe("sample test 101", () => {
  it("works as expected", () => {
    expect(1).toEqual(1);
  });

  it("handles ranges", () => {
    const age = 200;
    expect(age).toBeGreaterThan(100);
  });

  it("makes a list of dog names", () => {
    const dogs = ["Bella", "Catherine"];
    expect(Array.isArray(dogs)).toBeTruthy;
    expect(dogs).toContain("Bella");
  });
});
