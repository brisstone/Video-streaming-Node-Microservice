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
// const CustomerService = require('../services/customer-service');
const user_service_1 = require("../services/user-service");
const { CUSTOMER_SERVICE, SHOPPING_SERVICE, POST_SERVICE, } = require("../config");
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage, PublishMessage } = require("../utils");
module.exports = (app, channel) => {
    const service = new user_service_1.CustomerService();
    // To listen to all incoming events
    SubscribeMessage(channel, service);
    app.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, phone, name, image, type } = req.body;
            // return
            if (!email)
                res.status(400).send("All Fields Required");
            const { data } = yield service.SignUp({
                email,
                password,
                phone,
                name,
                type,
            });
            console.log(data, "bbbbbbb");
            if (data._id) {
                const payload = {
                    event: "USER_CREATED",
                    data,
                };
                PublishMessage(channel, POST_SERVICE, JSON.stringify(payload));
            }
            res.json(data);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send("SERVER ERROR");
        }
    }));
    app.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, image, name, type } = req.body;
            const { data } = yield service.SignIn({
                email,
                password,
                image,
                name,
                type,
            });
            res.json(data);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send("SERVER ERROR");
        }
    }));
    app.get("/users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data } = yield service.getAllUsers();
            res.json(data);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send("SERVER ERROR");
        }
    }));
    // app.get("/profile", UserAuth, async (req: Request, res: Response, next: Next) => {
    //   const { _id } = req.user;
    //   const { data } = await service.GetProfile({ _id });
    //   res.json(data);
    // });
    app.get("/profile/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.params, "sdjsdjsd");
        const { id } = req.params;
        const { data } = yield service.GetProfile(id);
        console.log(data, "kkkkkkkkkkkkkkkkkkkkk");
        res.json(data);
    }));
};
