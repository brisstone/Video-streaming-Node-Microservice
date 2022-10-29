"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const { PostRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, } = require("../utils");
// All Business logic will be here
class PostsService extends PostRepository {
    constructor() {
        super();
    }
    PostContent(userInputs) {
        const _super = Object.create(null, {
            FindUser: { get: () => super.FindUser },
            CreatePost: { get: () => super.CreatePost }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = userInputs;
            const existingCustomer = yield _super.FindUser.call(this, { userId });
            if (existingCustomer) {
                const postContents = yield _super.CreatePost.call(this, userInputs);
                return FormateData(postContents);
            }
            return FormateData(null);
        });
    }
    // eventObject;
    UploadPostVideo(id, videoUrl, videoId) {
        const _super = Object.create(null, {
            savePost: { get: () => super.savePost }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // const { id, videoUrl, videoId } = userInputs;
            const existingPost = yield _super.savePost.call(this, id, videoUrl, videoId);
            if (existingPost) {
                return FormateData(existingPost);
            }
        });
    }
    GetAllPost() {
        const _super = Object.create(null, {
            GetPosts: { get: () => super.GetPosts }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield _super.GetPosts.call(this);
            return FormateData(allPosts);
        });
    }
    GetPost(id) {
        const _super = Object.create(null, {
            RetrievePost: { get: () => super.RetrievePost }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const Post = yield _super.RetrievePost.call(this, id);
            return FormateData(Post);
        });
    }
    UserCreated(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userInputs, "userInputsuserInputs");
        });
    }
    SubscribeEvents(payload) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.PostsService = PostsService;
