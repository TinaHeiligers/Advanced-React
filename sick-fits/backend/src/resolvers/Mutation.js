// All mutations have to mirror the schema in schema.graphql
// The database is on the context, refered to in here as ctx.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto"); //built in node module
const { promisify } = require("util"); // built in node module
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }
    // create a relationship bewteen the user and the object
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );
    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`);
    // 2. check if they own the item or have permissions to delete it
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );
    if (!ownsItem || !hasPermissions) {
      throw new Error("You don't have permission to do that!");
    }
    // 3. delete the item
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // 1 lowercase email address
    args.email = args.email.toLowerCase();
    // hash their password with a given SALT of 10 -> ensure uniqueness
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    // create the JWT for the new user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the jwt as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with the email provided
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. check if their password is provided
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid password!");
    }
    // 3. generate the JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. set the cookie with the tooken
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 5. return the user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },
  async requestReset(parent, args, ctx, info) {
    // 1. check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No user found with that email address ${args.email}`);
    }
    // 2. set a reset token & expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; //1 hour
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // 3. email the user the token
    const mailRes = await transport.sendMail({
      from: "tina.heiligers@gmail.com",
      to: user.email,
      subject: "Your Password Reset Token",
      html: makeANiceEmail(`Your Password Reset Token is here!
       \n\n
       <a href="${
         process.env.FRONTEND_URL
       }/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
    });
    return { message: "Thanks!" };
  },
  async resetPassword(parent, args, ctx, info) {
    // check if the passwords match
    if (!args.password === args.confirmPassword) {
      throw new Error("The password and confirmation don't match");
    }
    // check it if's a ligit resetToken
    // check if it's expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) {
      throw new Error("Token is invalid or expired");
    }
    // hash the new password
    const password = await bcrypt.hash(args.password, 10);
    // save the new password to the user & remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { password, resetToken: null, resetTokenExpiry: null }
    });
    // generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // set JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // return user
    return updatedUser;
    //
  },
  async updatePermissions(parent, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do this");
    }
    // query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
    // check that the current user has permission to update permissions
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    // update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    // check if they are logged in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You need to log in first!");
    }
    // query the user's current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });
    // check if the user already has the item in their cart and increment by 1 if it is
    if (existingCartItem) {
      return await ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 }
        },
        info
      );
    }
    // if it's not, create a fresh item for that user
    return await ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId }
        },
        item: {
          connect: { id: args.id }
        }
      }
    });
  }
};

module.exports = Mutations;
