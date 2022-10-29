const { PostRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");

interface userInputs {
  videoId: string;
  videoUrl: string;
  userId: string;
  postedBy: string;
  likes: string;
  topic: string;
  email: string;
  caption: string;
  id?: string;
}

// All Business logic will be here
export class PostsService extends PostRepository {
  constructor() {
    super();
  }

  async PostContent(userInputs: userInputs) {
    const { userId } = userInputs;

    const existingCustomer = await super.FindUser({ userId });

    if (existingCustomer) {
      const postContents = await super.CreatePost(userInputs);

      return FormateData(postContents);
    }

    return FormateData(null);
  }

  // eventObject;

  async UploadPostVideo(id: string, videoUrl: string, videoId: string) {
    // const { id, videoUrl, videoId } = userInputs;
    const existingPost = await super.savePost(id, videoUrl, videoId);

    if (existingPost) {
      return FormateData(existingPost);
    }
  }

  async GetAllPost() {
    const allPosts = await super.GetPosts();
    return FormateData(allPosts);
  }

  async GetPost(id: string) {
    const Post = await super.RetrievePost(id);
    return FormateData(Post);
  }

  async UserCreated(userInputs: userInputs) {
    console.log(userInputs, "userInputsuserInputs");
  }

  async SubscribeEvents(payload: any) {
    console.log("Triggering.... Post Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "USER_CREATED":
        this.UserCreated(data);
        break;
      default:
        break;
    }
  }
}
