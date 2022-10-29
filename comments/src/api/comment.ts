// const PostsService = require('../services/customer-service');
import { PostsService } from "../services/comment-service";
const {
  CUSTOMER_SERVICE,
  SHOPPING_SERVICE,
  COMMENT_SERVICE,
} = require("../config");
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage, PublishMessage } = require("../utils");
import { Request, Response, Next } from "express";

interface userInputs {
  comment?: string; // Note the '?' for optional property
  postedBy?: string;
  postId: string;
}

module.exports = (app: any, channel: any) => {
  const service = new PostsService();

  // To listen
  SubscribeMessage(channel, service, COMMENT_SERVICE);

  app.put(
    "/create",
    UserAuth,
    async (req: Request, res: Response, next: Next) => {
      const userId = req.user._id;
      try {
        const { comment, postedBy, postId }: userInputs = req.body;
        if (!comment) res.status(400).send("All Fields Required");

        const { data } = await service.CreateComment({
          postId,
          comment,
          postedBy,
          userId,
        });
        res.json(data);
      } catch (error) {
        console.log(error, "ERROR");
      }
    }
  );

  app.get("/comment/:id", async (req: Request, res: Response, next: Next) => {
    const { id } = req.params;
    try {
      if (!id) res.status(400).send("Id Field Required");

      const { data } = await service.getComment(id);
      res.json(data);
    } catch (error) {
      console.log(error, "ERROR");
    }
  });
};
