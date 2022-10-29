// import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import express from "express";
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");


dotenv.config();

const StartServer = async () => {
  const app = express();


   app.get("/", (req: any, res: any) => {
     res.status(200).send("Post Area You're good for me");
   });

  try {
    await databaseConnection();

    //Connect to RabbitMQ
    const channel = await CreateChannel();

    await expressApp(app, channel);

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
    console.log(process.env, "processsssssss-------------");
    console.log(error, "livite");
  }
};

StartServer();
