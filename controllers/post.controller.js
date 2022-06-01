const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const ObjectID = require("mongoDB").ObjectId;
const { uploadErrors } = require("../utils/errors.utils");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

module.exports.readPost = (req, res) => {
  postModel
    .find((err, docs) => {
      if (!err) res.send(docs);
      else console.log("Error in Retriving Post :" + err);
    })
    .sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {
  let fileName;
  if (req.file != null) {
    try {
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      )
        throw Error("invalid file");
  
      if (req.file.size > 500000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    }
    fileName = req.body.posterID + Date.now() + ".jpg";
  }
  
  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/posts/${fileName}`
    )
  );

  const newPost = new postModel({
    posterID: req.body.posterID,
    message: req.body.message,
    picture: req.file != null ? "./uploads/posts/"+ fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID unknown :" + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };
  postModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, doc) => {
      if (!err) res.send(doc);
      else console.log("Error in Post Update :" + err);
    }
  );
};

module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send("ID unknown :" + req.params.id);

  postModel.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) res.send(doc);
    else console.log("Error in Post Delete :" + err);
  });
};

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await postModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true }
      )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));

    await userModel
      .findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true }
      )
      .then((data) => res.send(data))

      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.unLikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await postModel
      .findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true }
      )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));

    await userModel
      .findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true }
      )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return postModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, doc) => {
        if (!err) res.send(doc);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    return postModel.findById(req.params.id, (err, doc) => {
      const thisComment = doc.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      if (!thisComment) return res.status(404).send("Comment not found");
      thisComment.text = req.body.text;

      return doc.save((err) => {
        if (!err) res.status(200).send(doc);
        else return res.status(400).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    return postModel.findByIdAndDelete(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

// 3h40
