const { CommentRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");

interface userInputs {
  postId: string;
  comment: string;
  postedBy: string;
  userId: string;
}

// All Business logic will be here
export class PostsService extends CommentRepository {
  constructor() {
    super();
  }

  async PostCreated(userInputs: userInputs) {
    const createPost = await super.createPost(userInputs);

    return FormateData(createPost);
  }

  async CreateComment(userInputs: userInputs) {
    const { postId, comment, postedBy, userId } = userInputs;

    const createPost = await super.AddComment({
      postId,
      comment,
      postedBy,
      userId,
    });

    return FormateData(createPost);
  }

  async getAllComments() {
    const comments = await super.RetrieveAllComments();
    return FormateData(comments);
  }

  async getComment(id: string) {
    const createPost = await super.RetrieveComment(id);

    return FormateData(createPost);
  }

  async SubscribeEvents(payload: any) {
    console.log("Triggering.... Comment Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;

    switch (event) {
      case "POST_CREATED":
        this.PostCreated(data.data);
        break;
      default:
        break;
    }
  }
}
