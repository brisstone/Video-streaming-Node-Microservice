// const PostsService = require('../services/customer-service');
import { PostsService } from "../services/post-service";
const { POST_SERVICE, COMMENT_SERVICE } = require("../config");
import { videoUpload } from "../config/multerConfig";
import { Request, Response, Next } from "express";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage, PublishMessage, eventObject } = require("../utils");

interface userInputs {
  videoId?: string; // Note the '?' for optional property
  videoUrl?: string;
  userId?: string;
  postedBy?: string;
  likes?: string;
  topic?: string;
  caption?: string;
}

module.exports = (app: any, channel: any) => {
  const service = new PostsService();

  // To listen to user creation on exchange
  SubscribeMessage(channel, service, POST_SERVICE);

  app.post(
    "/create",
    UserAuth,
    videoUpload.single("user-video"),
    async (req: Request, res: Response, next: Next) => {
      const userId = req.user._id;
      try {
        const {
          caption,
          videoId,
          videoUrl,
          postedBy,
          likes,
          topic,
        }: userInputs = req.body;

        if (!topic) res.status(400).send("All Fields Required");

        // videoUrl, userId, postedBy, likes, topic, emai;
        const { data } = await service.PostContent({
          caption,
          videoId,
          videoUrl,
          postedBy,
          likes,
          topic,
          userId,
        });

        if (data) {
          const videoUpld = await uploadToCloudinary(
            req.file.path,
            "user-certifications"
          );

          const uploaded = await service.UploadPostVideo(
            data._id,
            videoUpld.url,
            videoUpld.public_id
          );

          const payload = eventObject(uploaded, "POST_CREATED");

          PublishMessage(channel, COMMENT_SERVICE, JSON.stringify(payload));
          res.json(uploaded);
        }

        return res.json("Post doesn't exist");
      } catch (error) {
        console.log(error);
      }
    }
  );

  app.get("/posts", async (req: Request, res: Response, next: Next) => {
    try {
      const allPosts = await service.GetAllPost();
      res.json(allPosts);
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/post/:id", async (req: Request, res: Response, next: Next) => {
    const { id } = req.params;
    try {
      const Post = await service.GetPost(id);
      res.json(Post);
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/post/like/:id", async (req: Request, res: Response, next: Next) => {
    const { id } = req.params;

    const { userId, postId, like } = req.body;
    try {
      const Post = await service.GetPost(id);
      res.json(Post);
    } catch (error) {
      console.log(error);
    }
  });
};
