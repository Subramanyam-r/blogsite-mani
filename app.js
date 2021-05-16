//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://paymate:' + process.env.MONGOPASSWORD + '@paymate.nxpho.mongodb.net/blogSiteDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("post", postSchema);

const homeStartingContent = "Hello! This is a blog project website I did while learning web development. It's a basic website which store blog posts in MongoDB and displays them in homepage. To compose a new blog post click the link below!";
const aboutContent = "Hello, I'm Subramanyam, currently pursuing Production Engineering at National Institute of Technology, Tiruchirapalli. My main interests are making websites. Web development is an ocean of knowledge and I strongly believe that it can only be mastered with lot of practise and experience.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){

  Post.find({}, (err, docs) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: docs
      });
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  await post.save();

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const id = req.params.postName;

  Post.findOne({_id: id}, (err, docs)=> {
    res.render("post", {
      title: docs.title,
      content: docs.content
    });
  });

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port" + process.env.PORT);
});
