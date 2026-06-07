const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const mongoose = require("mongoose");


const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const userAccount = await Account.findOne({
        userId: req.userId
    });

    if (!userAccount) {
        return res.status(404).json({ message: "Account not found" });
    }
    const last4 = String(req.userId).slice(-4);
    res.json({
        balance: userAccount.balance,
        idLast4: last4
        
    });
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { amount, to } = req.body;

        const senderAcc = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!senderAcc || senderAcc.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const receiverAcc = await Account.findOne({
            userId: to
        }).session(session);

        if (!receiverAcc) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid receiver"
            });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            message: "Transfer failed",
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

module.exports = router;