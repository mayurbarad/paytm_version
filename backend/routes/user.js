import express from "express";
import zod, { isValid } from "zod";
import jwt from "jsonwebtoken";
import { User, Account } from "../db.js";
import { JWT_SECRET } from "../config.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

router.get("/validate", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Token is valid",
  });
});

const signupSchema = zod.object({
  firstName: zod.string().min(1, { message: "First Name is required!" }),
  lastName: zod.string().min(1, { message: "Last Name is required!" }),
  username: zod.string().email({ message: "Invalid email!" }),
  password: zod
    .string()
    .min(8, { message: "Password must be at least of 8 characters long!" }),
});

router.post("/signup", async (req, res) => {
  try {
    // zod input validation
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.errors,
      });
    }

    const { firstName, lastName, username, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({
      username,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists!",
      });
    }
    // make instance of user
    const newUser = new User({ firstName, lastName, username });

    const hashedPassword = await newUser.createHash(password);
    newUser.password_hash = hashedPassword;

    await newUser.save();

    // create new Account
    const balanceINR = (Math.random() * 100 + 1).toFixed(2);
    const balancePaisa = Math.floor(balanceINR * 100);
    await Account.create({
      userId: newUser._id,
      balance: balancePaisa,
    });

    // create jwt(token) for user
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User created successfully!",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while Signing Up. Please try again later." });
  }
});

const signinSchema = zod.object({
  username: zod.string().email({ message: "Invalid email!" }),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  try {
    //zod input validation
    const result = signinSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }
    // Find the user
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // validate password with hashed password
    const isValidPassword = await user.validatePassword(req.body.password);
    if (isValidPassword) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        token: token,
        message: "User Successfully Logged In",
      });
    } else {
      return res.status(401).json({
        message: "Incorrect Password!",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while logging in. Please try again later." });
  }
});

const updateSchema = zod.object({
  password: zod.string().min(8, "Password is too small!").optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

// UPDATE USER INFORMATION - password, first name, and last name
router.put("/", authMiddleware, async (req, res) => {
  const result = updateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Error while updating!",
    });
  }

  const { password, firstName, lastName } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (password) {
      const hashedPassword = await user.createHash(password);
      user.password_hash = hashedPassword;
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    res.status(200).json({
      message: "Updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while updating!",
    });
  }
});

// GET USERS, FILTERABLE VIA firstName and lastName, to search friends and send money
router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  try {
    const users = await User.find({
      //exclude current user
      _id: { $ne: req.userId },
      $or: [
        {
          firstName: { $regex: filter, $options: "i" },
        },
        {
          lastName: { $regex: filter, $options: "i" },
        },
      ],
    }).select("firstName lastName username");

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching users!",
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  });
});

export default router;
