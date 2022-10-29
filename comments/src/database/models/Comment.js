"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    postId: String,
    topic: String,
    comments: [
        {
            comment: String,
            postedBy: String,
            userId: String,
        },
    ],
    postedBy: String,
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        },
    },
    timestamps: true,
});
module.exports = (0, mongoose_1.model)("comment", PostSchema);
