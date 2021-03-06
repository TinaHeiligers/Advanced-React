import formatMoney from "../lib/formatMoney";
describe("formatMoney", () => {
  it("works with fractional dollars", () => {
    expect(formatMoney(1)).toEqual("$0.01");
    expect(formatMoney(10)).toEqual("$0.10");
    expect(formatMoney(9)).toEqual("$0.09");
    expect(formatMoney(40)).toEqual("$0.40");
  });
  it("returns the whole dollar amount if there aren't any cents", () => {
    expect(formatMoney(1000)).toEqual("$10");
    expect(formatMoney(100)).toEqual("$1");
    expect(formatMoney(50000000)).toEqual("$500,000");
  });
  it("works with whole and fractional dollars", () => {
    expect(formatMoney(5012)).toEqual("$50.12");
    expect(formatMoney(101)).toEqual("$1.01");
    expect(formatMoney(110)).toEqual("$1.10");
    expect(formatMoney(1298263520895467)).toEqual("$12,982,635,208,954.67");
  });
});
