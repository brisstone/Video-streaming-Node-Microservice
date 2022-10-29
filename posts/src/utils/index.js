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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const { APP_SECRET, EXCHANGE_NAME, CUSTOMER_SERVICE, MSG_QUEUE_URL, USER_CREATED, POST_SERVICE, } = require("../config");
//Utility functions
module.exports.GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.genSalt();
});
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.hash(password, salt);
});
module.exports.ValidatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield GeneratePassword(enteredPassword, salt)) === savedPassword;
});
(module.exports.GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
})),
    (module.exports.ValidateSignature = (req) => __awaiter(void 0, void 0, void 0, function* () {
        const signature = req.get("Authorization");
        try {
            if (signature) {
                const payload = yield jwt.verify(signature.split(" ")[1], APP_SECRET);
                req.user = payload;
                return true;
            }
        }
        catch (error) {
            // if (error.expiredAt) {
            //   return "TOken Expired";
            // }
            return false;
        }
        return false;
    }));
module.exports.FormateData = (data) => {
    if (data) {
        return { data };
    }
    else {
        throw new Error("Data Not found!");
    }
};
module.exports.eventObject = (data, event) => {
    if (data) {
        const payload = {
            event,
            data,
        };
        return payload;
    }
    else {
        throw new Error("Data Not found!");
    }
};
//Message Broker
module.exports.CreateChannel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib.connect(MSG_QUEUE_URL);
        const channel = yield connection.createChannel();
        yield channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
        return channel;
    }
    catch (err) {
        console.log(err, "djsjjsj");
        throw err;
    }
});
module.exports.PublishMessage = (channel, service, msg) => __awaiter(void 0, void 0, void 0, function* () {
    yield channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
});
module.exports.SubscribeMessage = (channel, service, bindingKey) => __awaiter(void 0, void 0, void 0, function* () {
    yield channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const q = yield channel.assertQueue("postQueue");
    console.log(` Waiting for messages coming into queue: ${q.queue}`);
    //  binding key is what identifies the postQueue created, so exchange can send msg to it
    channel.bindQueue(q.queue, EXCHANGE_NAME, bindingKey);
    channel.consume(q.queue, (msg) => {
        if (msg.content) {
            console.log("the message is:", msg.content.toString());
            service.SubscribeEvents(msg.content.toString());
        }
        console.log("[X] received");
    }, {
        noAck: true,
    });
});
module.exports.GeneratePassword = GeneratePassword;
