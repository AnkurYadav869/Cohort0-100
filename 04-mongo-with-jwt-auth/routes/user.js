const express = require("express");
const router = express.Router();
const userMiddleware = require("../middleware/user");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const { User, Course } = require("../db/index");
router.use(express.json());
// User Routes
router.post("/signup", async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    const userAlreadyPresent = await User.findOne({ username, password });
    if (userAlreadyPresent) {
        res.status(500).json({ msg: "User already present" });
    } else {
        await User.create({ username, password });
        res.json({ msg: "User added successful" });
    }
});

router.post("/signin", async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const isUserPresent = await User.findOne({ username, password });
    if (isUserPresent) {
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ token });
    } else {
        res.status(411).json({ msg: "User not authenticated" });
    }
});

router.get("/courses", async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find({});
    res.json({ courses });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseID = req.params.courseId;
    const isCoursePresent = await Course.findOne({ _id: courseID });
    const user = jwt.decode(req.headers.token.split(" ")[1], JWT_SECRET);
    // console.log(username)
    if (isCoursePresent) {
        try {
            await User.updateOne(
                { username: user.username },
                {
                    $push: {
                        purchasedCourse: courseID,
                    },
                }
            );

            res.json({ msg: "User updated." });
        } catch (e) {
            console.log(e);
        }
    } else {
        res.status(500).json({ msg: "Course not found" });
    }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    try {
        const user = jwt.decode(req.headers.token.split(" ")[1], JWT_SECRET);
        console.log("hi there", user);
        const userInfo = await User.findOne({ username: user.username });
        const coures = await Course.find({
            _id: {
                $in: userInfo.purchasedCourse,
            },
        });
        res.json({ coures });
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});

module.exports = router;
