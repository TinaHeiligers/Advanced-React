// This is where the database calls go, regardless of what db it is or where the info's comming from
// We write our custom queries in here with middleware to handle authenticatio
// If the query is exactly the same both on Prisma and on Yoga, we can forward the Yoga query directly to prisma
const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
