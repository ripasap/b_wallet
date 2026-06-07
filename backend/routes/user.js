const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config");
const {User, Account} = require("../db.js")
const router = express.Router();
const {authMiddleware} = require("../middleware.js")


router.get("/", (req, res) => {

})


router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("username firstName lastName");
  res.json({ username: user.username });
});


const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(body);

    if (!success) {
        return res.status(411).json({
            message: "Email already taken / incorrect inpuits"
        })
    }

    const existingUser = await User.findOne({
        username: body.username
    });

    if (existingUser) {
        return res.status(409).json({
            message: "Email already taken"
        });
    }

    const newUser = await User.create(body);
    const newUserId = newUser._id;

    await Account.create({
        userId: newUserId,
        balance: Math.floor(Math.random() * 10000) + 1
    });

    const token = jwt.sign({
        userId: newUserId
    }, JWT_SECRET);

    return res.json({
        message: "User created successfully",
        token
    });
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }


    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Error while updating information"
        });
    }

    await User.updateOne({
        _id: req.userId
    }, {
        $set: req.body
    });

    res.json({
        message: "Updated successfully"
    });
});

router.get("/me", authMiddleware, async (req, res) => {
    const user = await User.findById(req.userId).select("username firstName lastName");
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    res.json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    });
});

router.get("/bulk", async (req, res) => {
    const rawFilter = req.query.filter || "";
    const filter = String(rawFilter).replace(/^"(.*)"$/, "$1").trim();
    const cleanFilter = filter.startsWith("@") ? filter.substring(1) : filter;

    const users = await User.find({
        $or: [{
            username: {
                $regex: cleanFilter,
                $options: "i"
            }
        }, {
            firstName: {
                $regex: cleanFilter,
                $options: "i"
            }
        }, {
            lastName: {
                $regex: cleanFilter,
                $options: "i"
            }
        }]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
})

module.exports = router;