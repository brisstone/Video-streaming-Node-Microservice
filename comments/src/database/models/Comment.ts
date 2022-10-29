import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    postId: String,
    topic: String,
    comments: [
      {
        comment: String,
        postedBy: String,
        userId: String,
      },
    ],
    postedBy: String,
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

module.exports = model("comment", PostSchema);
