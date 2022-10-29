const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  EXCHANGE_NAME,
  CUSTOMER_SERVICE,
  MSG_QUEUE_URL,
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

    if (signature) {
      const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
      req.user = payload;
      return true;
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

//Message Broker
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    return channel;
  } catch (err) {
    console.log(err, "djsjjsj");
    throw err;
  }
};

module.exports.PublishMessage = async (
  channel: any,
  bindingKey: any,
  msg: any
) => {
  // Create the exchange if it doesn't exist
  await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
  channel.publish(EXCHANGE_NAME, bindingKey, Buffer.from(msg));
  console.log(`Message ${msg} Sent to exchange ${EXCHANGE_NAME}`);
};

module.exports.SubscribeMessage = async (
  channel: any,
  service: any,
  bindingKey: any
) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });

  //Create UserQueue if it doesn't exist and start listening to incoming messages on it
  const q = await channel.assertQueue("UserQueue");

  console.log(`Waiting for messages coming into queue: ${q.queue}`);

  //binding key is what identifies the postQueue created, so exchange can send msg to it
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
