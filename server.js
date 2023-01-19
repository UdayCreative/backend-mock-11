const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();

const { UserModel } = require("./models/Users.model");
const { auth } = require("./middlewares/authentication");
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("WelCome to Backend");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const userAccount = await UserModel.findOne({ email });
  if (userAccount?.email) {
    res.send("Try Login, Account already exist");
  } else {
    try {
      bcrypt.hash(password, 8, async function (e, hash) {
        const userAccount = new UserModel({ email, password: hash });
        await userAccount.save();
        res.send("Sign-Up Successfull");
      });
    } catch (error) {
      console.log(error);
      res.send("Something went wrong, please try again later");
    }
  }
});
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await UserModel.find({ email });

    if (users.length > 0) {
      const userPassword = users[0].password;
      bcrypt.compare(password, userPassword, function (error, login) {
        if (login) {
          const token = jwt.sign({ userID: userPassword[0]._id }, "shhhhh");
          res.send({ message: "Login Successfull", token: token });
        } else {
          res.send("Login failed, please insert correct password");
        }
      });
    } else {
      res.send("Login failed, please insert correct password");
    }
  } catch (error) {
    console.log(error);
    res.send("Something went wrong, please try again later");
  }
});

app.use(auth);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB Successfully");
  } catch (err) {
    console.log(err);
    console.log("Error connecting to DB");
  }
  console.log(`Listening on PORT ${process.env.PORT}`);
});
