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
exports.CustomerService = void 0;
const { UserRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, } = require("../utils");
// All Business logic will be here
class CustomerService extends UserRepository {
    constructor() {
        super();
    }
    SignIn(userInputs) {
        const _super = Object.create(null, {
            FindUser: { get: () => super.FindUser }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, type } = userInputs;
            const existingUsers = yield _super.FindUser.call(this, { email });
            console.log(existingUsers, "dkfkf");
            if (existingUsers) {
                if (type == "oauth") {
                    const token = yield GenerateSignature({
                        email: existingUsers.email,
                        _id: existingUsers._id,
                    });
                    return FormateData({ id: existingUsers._id, token });
                }
                else {
                    const validPassword = yield ValidatePassword(password, existingUsers.password, existingUsers.salt);
                    if (validPassword) {
                        const token = yield GenerateSignature({
                            email: existingUsers.email,
                            _id: existingUsers._id,
                        });
                        return FormateData({ id: existingUsers._id, token });
                    }
                    else {
                        return FormateData({ data: "Incorrect Password" });
                    }
                }
            }
            else {
                console.log("data npoooooooooooo");
                if (type == "oauth") {
                    const data = yield this.SignUp(userInputs);
                    console.log(data, "data");
                    return FormateData({ id: data.id, token: data.token });
                }
                else {
                    return FormateData("User Not Found");
                }
            }
        });
    }
    SignUp(userInputs) {
        const _super = Object.create(null, {
            FindUser: { get: () => super.FindUser },
            CreateUser: { get: () => super.CreateUser }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, phone, name, image, type } = userInputs;
                const existingUsers = yield _super.FindUser.call(this, { email });
                if (existingUsers)
                    return FormateData("User Already Exists");
                // create salt
                let salt = yield GenerateSalt();
                let userPassword;
                if (type != "oauth") {
                    userPassword = yield GeneratePassword(password, salt);
                }
                const newUser = yield _super.CreateUser.call(this, {
                    email,
                    password: userPassword,
                    phone,
                    salt,
                    name,
                    image,
                });
                const token = yield GenerateSignature({
                    email: email,
                    _id: newUser._id,
                });
                const data = {
                    id: newUser._id,
                    token,
                };
                return FormateData(data);
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersResult = yield this.retrieveUsers();
                return FormateData(usersResult);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    GetProfile(id) {
        const _super = Object.create(null, {
            FindUserById: { get: () => super.FindUserById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield _super.FindUserById.call(this, id);
            return FormateData(existingUser);
        });
    }
    SubscribeEvents(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Triggering.... User Events");
            payload = JSON.parse(payload);
            const { event, data } = payload;
            const { userId, product, order, qty } = data;
            switch (event) {
                case "CREATE_ORDER":
                    this.ManageOrder(userId, order);
                    break;
                default:
                    break;
            }
        });
    }
}
exports.CustomerService = CustomerService;
