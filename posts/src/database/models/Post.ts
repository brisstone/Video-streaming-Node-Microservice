import { Schema, model } from "mongoose";

// Create an interface representing a document in MongoDB.
interface IPost {
  caption: string;
  videoId: string;
  videoUrl: string;
  userId: string;
  postedBy: string;
  likes: string;
  comments: {
    comment: String;
    postedBy: String;
  };
}


const PostSchema = new Schema<IPostr>(
  {
    caption: String,
    videoId: String,
    videoUrl: String,
    userId: String,
    postedBy: String,
    likes: String,
    comments: [
      {
        comment: String,
        postedBy: String,
      },
    ],
    topic: String,
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

module.exports = model<IPost>("post", PostSchema);
