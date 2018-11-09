// This is where the database calls go, regardless of what db it is or where the info's comming from
// We write our custom queries in here with middleware to handle authenticatio
// If the query is exactly the same both on Prisma and on Yoga, we can forward the Yoga query directly to prisma
const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    //check if there is a current UserId
    if(!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId },
    }, info);
  },
};

module.exports = Query;
