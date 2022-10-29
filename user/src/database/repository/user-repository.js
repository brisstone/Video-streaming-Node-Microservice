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
const mongoose = require("mongoose");
const { UserModel, AddressModel } = require("../models");
//Dealing with data base operations
class UserRepository {
    CreateUser(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, phone, salt, name, image } = config;
            const user = new UserModel({
                email,
                password,
                salt,
                phone,
                name,
                image,
            });
            const userResult = yield user.save();
            return userResult;
        });
    }
    retrieveUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const userResult = yield UserModel.find();
            return userResult;
        });
    }
    FindUser({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUsers = yield UserModel.findOne({ email: email });
            return existingUsers;
        });
    }
    FindUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUsers = yield UserModel.findById(id);
            return existingUsers;
        });
    }
}
module.exports = UserRepository;
