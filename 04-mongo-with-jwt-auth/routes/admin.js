const express = require("express");
const adminMiddleware = require("../middleware/admin");
const router = express.Router();
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const { Admin, Course } = require("../db/index");
router.use(express.json());
// Admin Routes
router.post("/signup", async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const alreadyPresentUser = await Admin.findOne({ username, password });
    if (alreadyPresentUser) {
        res.status(500).json({ msg: "User already present" });
    } else {
        try {
            await Admin.create({ username, password });
            res.json({ msg: "Admin user created" });
        } catch (e) {
            console.log(e);
        }
    }
});

router.post("/signin", async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const isAdminUserPresent = await Admin.findOne({ username, password });
    if (isAdminUserPresent) {
        const token = jwt.sign({ username }, JWT_SECRET);
        res.send({ token });
    } else {
        res.status(411).json({ msg: "User not present" });
    }
});

router.post("/courses", adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;
    console.log("hi there")
    const course = await Course.create({
        title,
        description,
        price,
        imageLink,
    });

    res.json({ msg: "Course created", courseID: course._id });
});

router.get("/courses", adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find({});

    res.json({ courses });
});

module.exports = router;
