import UpdateItem from '../components/UpdateItem';
// NB: item info is available within the page context, in __app.js we have set pageProps.query = ctx.query;
const Sell = ({ query }) => (
  <div>
    <UpdateItem id={ query.id }/>
  </div>
);
export default Sell;
