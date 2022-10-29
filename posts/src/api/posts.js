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
// const PostsService = require('../services/customer-service');
const post_service_1 = require("../services/post-service");
const { POST_SERVICE, COMMENT_SERVICE } = require("../config");
const multerConfig_1 = require("../config/multerConfig");
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage, PublishMessage, eventObject } = require("../utils");
module.exports = (app, channel) => {
    const service = new post_service_1.PostsService();
    // To listen to user creation on exchange
    SubscribeMessage(channel, service, POST_SERVICE);
    app.post("/create", UserAuth, multerConfig_1.videoUpload.single("user-video"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user._id;
        try {
            const { caption, videoId, videoUrl, postedBy, likes, topic, } = req.body;
            if (!topic)
                res.status(400).send("All Fields Required");
            // videoUrl, userId, postedBy, likes, topic, emai;
            const { data } = yield service.PostContent({
                caption,
                videoId,
                videoUrl,
                postedBy,
                likes,
                topic,
                userId,
            });
            if (data) {
                const videoUpld = yield (0, cloudinaryConfig_1.uploadToCloudinary)(req.file.path, "user-certifications");
                const uploaded = yield service.UploadPostVideo(data._id, videoUpld.url, videoUpld.public_id);
                const payload = eventObject(uploaded, "POST_CREATED");
                PublishMessage(channel, COMMENT_SERVICE, JSON.stringify(payload));
                res.json(uploaded);
            }
            return res.json("Post doesn't exist");
        }
        catch (error) {
            console.log(error);
        }
    }));
    app.get("/posts", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allPosts = yield service.GetAllPost();
            res.json(allPosts);
        }
        catch (error) {
            console.log(error);
        }
    }));
    app.get("/post/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const Post = yield service.GetPost(id);
            res.json(Post);
        }
        catch (error) {
            console.log(error);
        }
    }));
    app.get("/post/like/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { userId, postId, like } = req.body;
        try {
            const Post = yield service.GetPost(id);
            res.json(Post);
        }
        catch (error) {
            console.log(error);
        }
    }));
};
