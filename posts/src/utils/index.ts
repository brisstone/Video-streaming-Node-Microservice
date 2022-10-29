const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  EXCHANGE_NAME,
  CUSTOMER_SERVICE,
  MSG_QUEUE_URL,
  USER_CREATED,
  POST_SERVICE,
} = require("../config");

interface MyClassConfig {
  email?: string; // Note the '?' for optional property
  password?: string;
  phone?: string;
  salt?: string;
}

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};
const GeneratePassword = async (password: any, salt: any) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword: any,
  savedPassword: any,
  salt: any
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

(module.exports.GenerateSignature = async (payload: any) => {
  return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
}),
  (module.exports.ValidateSignature = async (req: any) => {
    const signature = req.get("Authorization");

    try {
      if (signature) {
        const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);

        req.user = payload;
        return true;
      }
    } catch (error) {
      // if (error.expiredAt) {
      //   return "TOken Expired";
      // }

      return false;
    }

    return false;
  });

module.exports.FormateData = (data: any) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

module.exports.eventObject = (data: any, event: string) => {
  if (data) {
    const payload = {
      event,
      data,
    };
    return payload;
  } else {
    throw new Error("Data Not found!");
  }
};

//Message Broker
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    console.log(err, "djsjjsj");
    throw err;
  }
};

module.exports.PublishMessage = async (
  channel: any,
  service: any,
  msg: any
) => {
  await channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};

module.exports.SubscribeMessage = async (
  channel: any,
  service: any,
  bindingKey: any
) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("postQueue");

  console.log(` Waiting for messages coming into queue: ${q.queue}`);

  //  binding key is what identifies the postQueue created, so exchange can send msg to it
  channel.bindQueue(q.queue, EXCHANGE_NAME, bindingKey);

  channel.consume(
    q.queue,
    (msg: any) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};

module.exports.GeneratePassword = GeneratePassword;
