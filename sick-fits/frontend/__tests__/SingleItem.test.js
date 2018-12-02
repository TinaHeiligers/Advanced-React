import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import SingleItem, { SINGLE_ITEM_QUERY } from "../components/SingleItem";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeItem } from "../lib/testUtils";
// the SingleItem is a query-wrapped component that has the client from ApolloProvider from the root App

describe("<SingleItem />", () => {
  it("renders with proper data", async () => {
    const mocks = [
      {
        // when someone makes a request with this query and variable combo, return the fake data given as the result
        request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
        result: {
          data: {
            item: fakeItem()
          }
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );
    // console.log(wrapper.debug());
    expect(wrapper.text()).toContain("Loading...");
    await wait(); // passes a timeout of 0, pushing the next call onto the callstack
    wrapper.update();
    expect(toJSON(wrapper.find("h2"))).toMatchSnapshot(); // we don't match the whole snapshot because the mocked apolo provider will come along too
    expect(toJSON(wrapper.find("img"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("p"))).toMatchSnapshot();
  });
  it("Errors with a not found item", async () => {
    const mocks = [
      {
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: { id: "123" }
        },
        result: {
          errors: [{ message: "Items not Found!" }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    const item = wrapper.find('[data-test="graphql-error"]');
    // console.log(item.debug());
    expect(item.text()).toContain("Items not Found!");
    expect(toJSON(item)).toMatchSnapshot();
  });
});
