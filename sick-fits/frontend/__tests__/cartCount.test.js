import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import CartCount from "../components/CartCount";

describe("<CartCount />", () => {
  it("renders out fine", () => {
    shallow(<CartCount count={10} />);
  });
  it("matches the snapshot", () => {
    const wrapper = shallow(<CartCount count={10} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  it("updates via props", () => {
    const wrapper = shallow(<CartCount count={50} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  it("checks updating via props with mount", () => {
    const wrapper = mount(<CartCount count={50} />);
    // console.log(wrapper.debug());
    return;
  });
});
