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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express, { Express, Request, Response } from "express";
const dotenv_1 = __importDefault(require("dotenv"));
const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");
dotenv_1.default.config();
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    try {
        yield databaseConnection();
        //Connect to RabbitMQ
        const channel = yield CreateChannel();
        yield expressApp(app, channel);
        app.get("/", (req, res) => {
            res.status(200).send("User Base; Reinkindle in me!");
        });
        app
            .listen(PORT, () => {
            console.log(`listening to port ${PORT}`);
        })
            .on("error", (err) => {
            console.log(err, "sksksk");
            process.exit();
        })
            .on("close", () => {
            channel.close();
        });
    }
    catch (error) {
        console.log(error, "koinmm");
    }
});
StartServer();
