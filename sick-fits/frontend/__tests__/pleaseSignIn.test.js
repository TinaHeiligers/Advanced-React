import { mount } from "enzyme";
import wait from "waait";
import PleaseSignIn from "../components/PleaseSignIn";
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

describe("<PleaseSignIn />", () => {
  it("renders Loading text while the query commences", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain("Loading...");
  });
  it("renders the sign in dialog to users who are not logged in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain("Please Sign In before continuing");
    expect(wrapper.find("Signin")).toBeTruthy;
    // console.log(wrapper.debug());
  });
  it("renders the child component when the user is signed in", async () => {
    const Hey = () => <p>Hey!</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Hey />
        </PleaseSignIn>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    expect(wrapper.contains(<Hey />)).toBeTruthy;
  });
});
