import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';
class MyApp extends App {
  // getInitialProps is a special next.js lifecycle method, this is ssr stuff
  // the static method will run first before the render runs. So all queries and mutations are fetched before the render executes.
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx); // crawls all the pages and fetches the stuff we need before it gets rendered.
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }
  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={ apollo }>
          <Page>
            <Component { ...pageProps } />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}
export default withData(MyApp);
