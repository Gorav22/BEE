var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");
var postModel=require('../models/PostModel');
var commentModel=require('../models/comment')


// Create a new post
router.post("/createPost", async (req, res) => {
  let { userId, title, content } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let post = await postModel.create({
      title: title,
      content: content,
      createdBy: userId
    });
    return res.json({ success: true, message: "Post created successfully", postId: post._id });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

// Get all posts
router.get("/getPosts", async (req, res) => {
  let posts = await postModel.find().populate('createdBy').populate('comments').populate('likes');
  return res.json({ success: true, posts: posts });
});

// Like a post


// Comment on a post
router.post("/commentPost", async (req, res) => {
  let { userId, postId, content } = req.body;
  let post = await postModel.findOne({ _id: postId });
  if (post) {
    let comment = await commentModel.create({
      content: content,
      createdBy: userId,
      post: postId
    });
    post.comments.push(comment._id);
    await post.save();
    return res.json({ success: true, message: "Comment added successfully" });
  } else {
    return res.json({ success: false, message: "Post not found!" });
  }
});

// Edit a post


// Delete a post
router.post("/deletePost", async (req, res) => {
  let { userId, postId } = req.body;
  let post = await postModel.findOne({ _id: postId, createdBy: userId });
  if (post) {
    await postModel.findOneAndDelete({ _id: postId });
    await commentModel.deleteMany({ post: postId });
    return res.json({ success: true, message: "Post deleted successfully" });
  } else {
    return res.json({ success: false, message: "Post not found or you are not the creator!" });
  }
});

const secret = "secret"; // secret key for jwt

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  if (emailCon) {
    return res.json({ success: false, message: "Email already exists" });
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        userModel.create({
          username: username,
          name: name,
          email: email,
          password: hash
        });
        return res.json({ success: true, message: "User created successfully" });
      });
    });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });

  if (user) {
    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        return res.json({ success: false, message: "An error occurred", error: err });
      }
      if (isMatch) {
        let token = jwt.sign({ email: user.email, userId: user._id }, secret);
        return res.json({ success: true, message: "User logged in successfully", token: token, userId: user._id });
      } else {
        return res.json({ success: false, message: "Invalid email or password" });
      }
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getUserDetails", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    return res.json({ success: true, message: "User details fetched successfully", user: user });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/createProject", async (req, res) => {
  let { userId, title } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.create({
      title: title,
      createdBy: userId
    });
    return res.json({ success: true, message: "Project created successfully", projectId: project._id });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProjects", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let projects = await projectModel.find({ createdBy: userId });
    return res.json({ success: true, message: "Projects fetched successfully", projects: projects });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/deleteProject", async (req, res) => {
  let { userId, progId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    await projectModel.findOneAndDelete({ _id: progId });
    return res.json({ success: true, message: "Project deleted successfully" });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.get("/public/projects", async (req, res) => {
  try {
    const projects = await projectModel.find({ isPublic: true }); // Assuming there's an `isPublic` field
    return res.json({ success: true, message: "Public projects fetched successfully", projects: projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/getProject", async (req, res) => {
  let { userId, projId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOne({ _id: projId });
    return res.json({ success: true, message: "Project fetched successfully", project: project });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/updateProject", async (req, res) => {
  let { userId, htmlCode, cssCode, jsCode, projId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOneAndUpdate(
      { _id: projId },
      { htmlCode: htmlCode, cssCode: cssCode, jsCode: jsCode },
      { new: true }
    );
    if (project) {
      return res.json({ success: true, message: "Project updated successfully" });
    } else {
      return res.json({ success: false, message: "Project not found!" });
    }
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

/* ---------------------- Administrative APIs ---------------------- */

router.get("/admin/getUsers", async (req, res) => {
  try {
    let users = await userModel.find({});
    return res.json({ success: true, message: "Users fetched successfully", users: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/admin/createUser", async (req, res) => {
  let { username, name, email, password } = req.body;
  try {
    let existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return res.status(500).json({ success: false, message: "Error generating salt", error: err });
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.status(500).json({ success: false, message: "Error hashing password", error: err });
        await userModel.create({
          username: username,
          name: name,
          email: email,
          password: hash
        });
        return res.json({ success: true, message: "User created successfully by admin" });
      });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});
router.get("/admin/projects", async (req, res) => {
  try {
    const projects = await projectModel.find({});
    return res.json({ success: true, message: "All projects fetched successfully", projects: projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});


router.put("/admin/updateUser/:id", async (req, res) => {
  let userId = req.params.id;
  let { username, name, email } = req.body;
  try {
    let user = await userModel.findByIdAndUpdate(
      userId,
      { username, name, email },
      { new: true }
    );
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User updated successfully", user: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

router.delete("/admin/deleteUser/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    let user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
