import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
// create mocks outside of the tests
export const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
];

export const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
];

export const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]
        }
      }
    }
  }
];

describe("<Nav />", () => {
  it("renders out a minimal nav when a user is not signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // we'll use a snapshot to test this.
    const nav = wrapper.find('[data-test="nav"]');
    expect(toJSON(nav)).toMatchSnapshot();
  });
  it("renders a full nav when a user is signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // Use a snapshot to test that the full nav is rendered
    const nav = wrapper.find("ul[data-test='nav']");
    expect(nav.children().length).toBe(6);
    expect(nav.text()).toContain("Sign Out");
    // expect(toJSON(nav)).toMatchSnapshot();
  });
  it("renders the amount of items in the cart", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // Use a snapshot to test that the full nav is rendered
    // console.log(wrapper.debug());
    const nav = wrapper.find("[data-test='nav']");
    // console.log(nav.debug());
    const count = nav.find("div.count");
    // console.log("count", count.debug());
    expect(toJSON(count)).toMatchSnapshot();
  });
});
