import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser } from "../lib/testUtils";
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
    // console.log(wrapper.debug());
  });
});
