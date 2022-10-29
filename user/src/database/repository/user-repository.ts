import { isValidObjectId } from "mongoose";

const mongoose = require("mongoose");
const { UserModel, AddressModel } = require("../models");

interface MyClassConfig {
  email?: string; // Note the '?' for optional property
  password?: string;
  phone?: string;
  salt?: string;
  name?: string;
  image?: string;
}

//Dealing with data base operations
class UserRepository {
  async CreateUser(config: MyClassConfig) {
    const { email, password, phone, salt, name, image } = config;

    const user = new UserModel({
      email,
      password,
      salt,
      phone,
      name,
      image,
    });

    const userResult = await user.save();
    return userResult;
  }

  async retrieveUsers() {
    const userResult = await UserModel.find();
    return userResult;
  }

  async FindUser({ email }: { email: string }) {
    const existingUsers = await UserModel.findOne({ email: email });
    return existingUsers;
  }

  async FindUserById(id: string) {
    const existingUsers = await UserModel.findById(id);
    return existingUsers;
  }
}

module.exports = UserRepository;
