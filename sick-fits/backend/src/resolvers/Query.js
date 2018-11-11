// This is where the database calls go, regardless of what db it is or where the info's comming from
// We write our custom queries in here with middleware to handle authenticatio
// If the query is exactly the same both on Prisma and on Yoga, we can forward the Yoga query directly to prisma
const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

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
  async users(parent, args, ctx, info) {
    // 1. check if they are logged in
    if(!ctx.request.userId) {
      throw new Error('You must be logged in')
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // 2. check if the user has the permissions to query all the users
    return ctx.db.query.users({}, info);
    // 3. query all the users
  }
};

module.exports = Query;
