import mongoose from "mongoose";
import { Schema, model } from "mongoose";

// Create an interface representing a document in MongoDB.
interface IUser {
  name: String;
  image: String;
  email: String;
  password: String;
  salt: String;
  phone: String;
  wishlist: [
    {
      _id: { type: String; require: true };
      name: { type: String };
      description: { type: String };
      banner: { type: String };
      avalable: { type: Boolean };
      price: { type: Number };
    }
  ];
}

const UserSchema = new Schema<IUser>(
  {
    name: String,
    image: String,
    email: String,
    password: String,
    salt: String,
    phone: String,
    wishlist: [
      {
        _id: { type: String, require: true },
        name: { type: String },
        description: { type: String },
        banner: { type: String },
        avalable: { type: Boolean },
        price: { type: Number },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = model<IUser>("user", UserSchema);
