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
const comment_service_1 = require("../services/comment-service");
const { CUSTOMER_SERVICE, SHOPPING_SERVICE, COMMENT_SERVICE, } = require("../config");
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage, PublishMessage } = require("../utils");
module.exports = (app, channel) => {
    const service = new comment_service_1.PostsService();
    // To listen
    SubscribeMessage(channel, service, COMMENT_SERVICE);
    app.put("/create", UserAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user._id;
        try {
            const { comment, postedBy, postId } = req.body;
            if (!comment)
                res.status(400).send("All Fields Required");
            const { data } = yield service.CreateComment({
                postId,
                comment,
                postedBy,
                userId,
            });
            res.json(data);
        }
        catch (error) {
            console.log(error, "ERROR");
        }
    }));
    app.get("/comment/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            if (!id)
                res.status(400).send("Id Field Required");
            const { data } = yield service.getComment(id);
            res.json(data);
        }
        catch (error) {
            console.log(error, "ERROR");
        }
    }));
};
