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
const { CommentModel } = require("../models");
//Dealing with data base operations
class CommentRepository {
    FindPost({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUserPost = yield CommentModel.findOne({ email: email });
            return existingUserPost;
        });
    }
    createPost(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, topic, postedBy } = config;
            const post = new CommentModel({
                postId: _id,
                topic,
                postedBy,
            });
            const postResult = yield post.save();
            return postResult;
        });
    }
    AddComment(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId, comment, postedBy, userId } = config;
            const query = { postId: postId };
            const commentCreated = yield CommentModel.updateOne(query, {
                $push: {
                    comments: {
                        comment: comment,
                        postedBy: postedBy,
                        userId: userId,
                    },
                },
            });
            if (!commentCreated)
                return "Comment Not Found";
            const getUpdatedPortfolio = yield CommentModel.findOne(query);
            return getUpdatedPortfolio;
        });
    }
    RetrieveAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield CommentModel.find();
            if (!comments)
                return "Comments Not Found";
            return comments;
        });
    }
    RetrieveComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield CommentModel.findOne({ postId: id });
            if (!comments)
                return "Comment Not Found";
            return comments;
        });
    }
}
module.exports = CommentRepository;
