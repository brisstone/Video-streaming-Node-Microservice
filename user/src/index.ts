// import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";


const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");


dotenv.config();

const StartServer = async () => {
  const app = express();

  try {
    await databaseConnection();

    //Connect to RabbitMQ
    const channel = await CreateChannel();

    await expressApp(app, channel);

    app.get("/", (req: any, res: any) => {
      res.status(200).send("User Base; Reinkindle in me!");
    });

    app
      .listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
      })
      .on("error", (err: any) => {
        console.log(err, "sksksk");
        process.exit();
      })
      .on("close", () => {
        channel.close();
      });
  } catch (error) {
    console.log(error, "koinmm");
  }
};

StartServer();
