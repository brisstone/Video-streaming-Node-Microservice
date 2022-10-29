const { UserRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");

interface userInputs {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  password: string;
  phone: string;
  name: string;
  image: string;
  type: string;
}

// All Business logic will be here
export class CustomerService extends UserRepository {
  constructor() {
    super();
  }

  async SignIn(userInputs: userInputs) {
    const { email, password, type } = userInputs;

    const existingUsers = await super.FindUser({ email });

    console.log(existingUsers, "dkfkf");

    if (existingUsers) {
      if (type == "oauth") {
        const token = await GenerateSignature({
          email: existingUsers.email,
          _id: existingUsers._id,
        });
        return FormateData({ id: existingUsers._id, token });
      } else {
        const validPassword = await ValidatePassword(
          password,
          existingUsers.password,
          existingUsers.salt
        );
        if (validPassword) {
          const token = await GenerateSignature({
            email: existingUsers.email,
            _id: existingUsers._id,
          });

          return FormateData({ id: existingUsers._id, token });
        } else {
          return FormateData({ data: "Incorrect Password" });
        }
      }
    } else {
      console.log("data npoooooooooooo");
      if (type == "oauth") {
        const data = await this.SignUp(userInputs);
        console.log(data, "data");

        return FormateData({ id: data.id, token: data.token });
      } else {
        return FormateData("User Not Found");
      }
    }
  }

  async SignUp(userInputs: userInputs) {
    try {
      const { email, password, phone, name, image, type } = userInputs;

      const existingUsers = await super.FindUser({ email });

      if (existingUsers) return FormateData("User Already Exists");

      // create salt
      let salt = await GenerateSalt();

      let userPassword;
      if (type != "oauth") {
        userPassword = await GeneratePassword(password, salt);
      }

      const newUser = await super.CreateUser({
        email,
        password: userPassword,
        phone,
        salt,
        name,
        image,
      });

      const token = await GenerateSignature({
        email: email,
        _id: newUser._id,
      });

      const data = {
        id: newUser._id,
        token,
      };

      return FormateData(data);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getAllUsers() {
    try {
      const usersResult = await this.retrieveUsers();

      return FormateData(usersResult);
    } catch (err) {
      console.log(err);
    }
  }

  async GetProfile(id: any) {
    const existingUser = await super.FindUserById(id);
    return FormateData(existingUser);
  }

  async SubscribeEvents(payload: any) {
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
  }
}
