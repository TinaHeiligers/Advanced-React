// This is where the database calls go, regardless of what db it is or where the info's comming from
// We write our custom queries in here with middleware to handle authenticatio
// If the query is exactly the same both on Prisma and on Yoga, we can forward the Yoga query directly to prisma
const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current UserId
    if (!ctx.request.userId) {
      return null;
    }
    const user = ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
    return user;
  },
  async users(parent, args, ctx, info) {
    // 1. check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    // 2. check if the user has the permissions to query all the users
    return ctx.db.query.users({}, info);
    // 3. query all the users
  },
  async order(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }
    // 2. Query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );
    // 3. Check if they have the permissions to see this order
    // check if the order's owner is the same as the user logged in:
    const ownsOrder = order.user.id === ctx.request.userId;
    // check if the user logged in has ADMIN permission:
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("You cannot see this order");
    }
    // 4. return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in!");
    }
    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId }
        }
      },
      info
    );
  }
};

module.exports = Query;
