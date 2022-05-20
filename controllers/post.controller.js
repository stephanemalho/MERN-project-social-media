const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const ObjectID = require("mongoDB").ObjectId;

module.exports.readPost = (req, res) => {
  postModel.find((err, docs) => {
    if (!err) res.send(docs);
    else
      console.log(
        "Error in Retriving Post :" + err + JSON.stringify(err, undefined, 2)
      );
  });
};

module.exports.createPost = async (req, res) => {
  const newPost = new postModel({
    posterID : req.body.posterID,
    message : req.body.message,
    video : req.body.video,
    likers : [],
    comments : [],
  })
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send('ID unknown :' + req.params.id);

  const updatedRecord = {
    message : req.body.message // reprendre à 3h de la vidéo de from scratch
  }
};
module.exports.deletePost = (req, res) => {};
