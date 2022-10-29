const mongoose = require("mongoose");
const { CommentModel } = require("../models");

interface MyClassConfig {
  postId?: string; // Note the '?' for optional property
  topic?: string;
  postedBy: string;
  _id: string;
  comment: string;
  userId: string;
}

//Dealing with data base operations
class CommentRepository {
  async FindPost({ email }: { email: string }) {
    const existingUserPost = await CommentModel.findOne({ email: email });
    return existingUserPost;
  }

  async createPost(config: MyClassConfig) {
    const { _id, topic, postedBy } = config;

    const post = new CommentModel({
      postId: _id,
      topic,
      postedBy,
    });

    const postResult = await post.save();
    return postResult;
  }

  async AddComment(config: MyClassConfig) {
    const { postId, comment, postedBy, userId } = config;

    const query = { postId: postId };

    const commentCreated = await CommentModel.updateOne(query, {
      $push: {
        comments: {
          comment: comment,
          postedBy: postedBy,
          userId: userId,
        },
      },
    });

    if (!commentCreated) return "Comment Not Found";

    const getUpdatedPortfolio = await CommentModel.findOne(query);

    return getUpdatedPortfolio;
  }

  async RetrieveAllComments() {
    const comments = await CommentModel.find();
    if (!comments) return "Comments Not Found";

    return comments;
  }

  async RetrieveComment(id: string) {
    const comments = await CommentModel.findOne({ postId: id });

    if (!comments) return "Comment Not Found";
    return comments;
  }
}

module.exports = CommentRepository;
