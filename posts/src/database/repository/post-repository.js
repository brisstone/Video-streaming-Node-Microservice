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
const mongoose = require("mongoose");
const { PostModel } = require("../models");
//Dealing with data base operations
class PostRepository {
    CreatePost(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { caption, videoUrl, userId, postedBy, likes, topic, email } = config;
            const user = new PostModel({
                caption,
                videoUrl,
                userId,
                postedBy,
                likes,
                topic,
            });
            const userResult = yield user.save();
            return userResult;
        });
    }
    FindUser({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUserPost = yield PostModel.findOne({ email: email });
            return existingUserPost;
        });
    }
    FindPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUserPost = yield PostModel.findById(id);
            return existingUserPost;
        });
    }
    GetPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const Posts = yield PostModel.find();
            return Posts;
        });
    }
    RetrievePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const Posts = yield PostModel.findById(id);
            return Posts;
        });
    }
    savePost(id, videoUrl, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUserPost = yield this.FindPost(id);
            if (existingUserPost) {
                const query = { _id: id };
                const Post = yield PostModel.updateOne(query, {
                    videoUrl: videoUrl,
                    videoId: videoId,
                });
                const getUpdatedPortfolio = yield PostModel.findOne(query);
                return getUpdatedPortfolio;
            }
            return "Post Does not exit";
        });
    }
}
module.exports = PostRepository;
