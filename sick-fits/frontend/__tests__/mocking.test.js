function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    // simulating an API
    setTimeout(() => resolve(this.foods), 1000);
  });
};

describe("mocking learning", () => {
  it("mocks a regular function", () => {
    const fetchDogs = jest.fn();
    fetchDogs("Bella");
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith("Bella");
    fetchDogs("Catherine");
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });
  it("can create a Person", () => {
    const me = new Person("Tina", ["tomatoes", "chicken"]);
    expect(me.name).toEqual("Tina");
  });
  it("can fetch foods", async () => {
    const hubby = new Person("Marc", ["sausages", "steak"]);
    // mock the favFoods function;
    hubby.fetchFavFoods = jest.fn().mockResolvedValue(["sushi", "lettuce"]);
    const favFoods = await hubby.fetchFavFoods();
    expect(favFoods).toContain("sushi");
  });
});
