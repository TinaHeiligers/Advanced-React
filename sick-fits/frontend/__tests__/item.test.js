import ItemComponent from "../components/Item";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";

const fakeItem = {
  id: "ABC123",
  title: "A Test Item",
  price: 5000,
  description: "An item for our tests!",
  image: "testImage.jpg",
  largeImage: "largeTestImage.jpg"
};

describe("<Item />", () => {
  it("renders and displays properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(wrapper.children()).toBeTruthy;
    // console.log(wrapper.debug());
  });
  it("renders the image properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find("img");
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });
  it("renders the price tag and the link to the item properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const PriceTag = wrapper.find("PriceTag");
    expect(PriceTag.children().text()).toBe("$50");
    expect(wrapper.find("Title a").text()).toBe(fakeItem.title);
    // console.log(PriceTag.children().text()); // .children takes us one level deeper
    // console.log(PriceTag.dive().text()); // .dive takes us one level deeper
  });
  it("renders out the buttons properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find(".buttonList");
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find("Link").exists()).toBe(true);
    expect(buttonList.find("AddToCart").exists()).toBe(true);
    expect(buttonList.find("DeleteItem").exists()).toBe(true);
  });
});

describe("<Item /> as snapshot", () => {
  it("renders and matches the snapshot", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
