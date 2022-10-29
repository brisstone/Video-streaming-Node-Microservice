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
const { CommentRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, } = require("../utils");
// All Business logic will be here
class PostsService extends CommentRepository {
    constructor() {
        super();
    }
    PostCreated(userInputs) {
        const _super = Object.create(null, {
            createPost: { get: () => super.createPost }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const createPost = yield _super.createPost.call(this, userInputs);
            return FormateData(createPost);
        });
    }
    CreateComment(userInputs) {
        const _super = Object.create(null, {
            AddComment: { get: () => super.AddComment }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, comment, postedBy, userId } = userInputs;
            const createPost = yield _super.AddComment.call(this, {
                postId,
                comment,
                postedBy,
                userId,
            });
            return FormateData(createPost);
        });
    }
    getAllComments() {
        const _super = Object.create(null, {
            RetrieveAllComments: { get: () => super.RetrieveAllComments }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield _super.RetrieveAllComments.call(this);
            return FormateData(comments);
        });
    }
    getComment(id) {
        const _super = Object.create(null, {
            RetrieveComment: { get: () => super.RetrieveComment }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const createPost = yield _super.RetrieveComment.call(this, id);
            return FormateData(createPost);
        });
    }
    SubscribeEvents(payload) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.PostsService = PostsService;
