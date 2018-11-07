// All mutations have to mirror the schema in schema.graphql
// The database is on the context, refered to in here as ctx.
const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO Check if they are logged in

    const item = await ctx.db.mutation.createItem({
        data: { ...args } }, info);
    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.query.item({ where }, `{ id title }`);
    // check if they own the item or have permissions to delete it
    // delete the item
    return ctx.db.mutation.deleteItem({ where }, info);
  },
};

module.exports = Mutations;
