import express from "express";
import { Account } from "../db.js";
import authMiddleware from "../middleware.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });
    const balanceINR = account.balance / 100;
    return res.status(200).json({ balance: balanceINR });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching balance!",
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;
  // fetch account
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );
  if (!account || account.balance / 100 < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance!",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account!",
    });
  }

  // Perform transfer
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount * 100 } }
  ).session(session);

  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount * 100 } }
  ).session(session);

  await session.commitTransaction();
  res.json({
    message: "Transfer successful!",
  });
});

export default router;
