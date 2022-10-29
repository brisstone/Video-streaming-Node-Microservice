const mongoose = require("mongoose");
const { PostModel } = require("../models");

interface MyClassConfig {
  videoId?: string; // Note the '?' for optional property
  videoUrl?: string;
  userId?: string;
  postedBy?: string;
  likes?: string;
  topic?: string;
  caption?: string;
}

//Dealing with data base operations
class PostRepository {
  async CreatePost(config: MyClassConfig) {
    const { caption, videoUrl, userId, postedBy, likes, topic, email } = config;

    const user = new PostModel({
      caption,
      videoUrl,
      userId,
      postedBy,
      likes,
      topic,
    });

    const userResult = await user.save();
    return userResult;
  }

  async FindUser({ email }: { email: string }) {
    const existingUserPost = await PostModel.findOne({ email: email });
    return existingUserPost;
  }

  async FindPost(id: string) {
    const existingUserPost = await PostModel.findById(id);
    return existingUserPost;
  }

  async GetPosts() {
    const Posts = await PostModel.find();
    return Posts;
  }

  async RetrievePost(id: string) {
    const Posts = await PostModel.findById(id);
    return Posts;
  }

  async savePost(id: string, videoUrl: string, videoId: string) {
    const existingUserPost = await this.FindPost(id);

    if (existingUserPost) {
      const query = { _id: id };

      const Post = await PostModel.updateOne(query, {
        videoUrl: videoUrl,
        videoId: videoId,
      });

      const getUpdatedPortfolio = await PostModel.findOne(query);

      return getUpdatedPortfolio;
    }

    return "Post Does not exit";
  }
}

module.exports = PostRepository;
