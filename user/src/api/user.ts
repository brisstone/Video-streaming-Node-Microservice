// const CustomerService = require('../services/customer-service');
import { CustomerService } from "../services/user-service";
const {
  CUSTOMER_SERVICE,
  SHOPPING_SERVICE,
  POST_SERVICE,
} = require("../config");
const UserAuth = require("./middlewares/auth");
import { Request, Response, Next } from "express";
const { SubscribeMessage, PublishMessage } = require("../utils");

interface userInputs {
  email: string;
  password: string;
  phone: string;
  street: string;
  name: string;
}

module.exports = (app: any, channel: any) => {
  const service = new CustomerService();

  // To listen to all incoming events
  SubscribeMessage(channel, service);

  app.post("/signup", async (req: Request, res: Response, next: Next) => {
    try {
      const { email, password, phone, name, image, type }: userInputs =
        req.body;

      // return
      if (!email) res.status(400).send("All Fields Required");

      const { data } = await service.SignUp({
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
    } catch (error) {
      console.log(error);
      return res.status(500).send("SERVER ERROR");
    }
  });

  app.post("/login", async (req: Request, res: Response, next: Next) => {
    try {
      const { email, password, image, name, type } = req.body;

      const { data } = await service.SignIn({
        email,
        password,
        image,
        name,
        type,
      });

      res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send("SERVER ERROR");
    }
  });

  app.get("/users", async (req: Request, res: Response, next: Next) => {
    try {
      const { data } = await service.getAllUsers();

      res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send("SERVER ERROR");
    }
  });

  // app.get("/profile", UserAuth, async (req: Request, res: Response, next: Next) => {
  //   const { _id } = req.user;
  //   const { data } = await service.GetProfile({ _id });
  //   res.json(data);
  // });

  app.get("/profile/:id", async (req: Request, res: Response, next: Next) => {
    console.log(req.params, "sdjsdjsd");
    const { id } = req.params;

    const { data } = await service.GetProfile(id);
    console.log(data, "kkkkkkkkkkkkkkkkkkkkk");
    res.json(data);
  });
};
