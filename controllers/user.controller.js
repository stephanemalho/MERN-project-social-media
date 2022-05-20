const userModel = require("../models/user.model");
const ObjectID = require("mongoDB").ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await userModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req,res) => {
  //console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send('ID unknown :' + req.params.id);

    userModel.findById(req.params.id, (err,docs) => {
      if (!err) res.send(docs);
      else console.log("ID unknown :" + err);
    }).select("-password");
};

module.exports.updateUser = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send('ID unknown :' + req.params.id);
  userModel
    .findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      }
    ) // find the user and update it
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) =>
      res.status(404).json({ error: "User not found" + error })
    );
};


module.exports.deleteUser = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send('ID unknown :' + req.params.id);
  userModel
    .findOneAndDelete({ _id: req.params.id }) // find the user and delete it
    .then((user) => {
      res.status(200).json({ message: "User deleted" });
    }) // send the response and the user
    .catch((error) =>
      res.status(404).json({ error: "User not found" + error })
    ); // if not found
};

module.exports.follow =  (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(404).send("ID unknown :" + req.params.id);

  try {
    userModel.findByIdAndUpdate(
      req.params.id,
      { $push: { following: req.body.idToFollow } },
      { new: true , upsert: true },
      (err, docs) => {
        if (!err) {
          res.status(200).json(docs);
        } else return res.status(404).json(err);
      }
    );
    userModel
      .findByIdAndUpdate(
        req.body.idToFollow,
        { $push: { followers: req.params.id } },
        { new: true, upsert: true },
        (err, docs) => {
          // if (!err) res.status(200).json(docs);
          if (err) return res.status(404).json(err);
        }
      )
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(404).send("ID unknown :" + req.params.id);

  try {
    userModel.findByIdAndUpdate( // find the user and update the following array
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true },
      (err, docs) => {
        if (!err) {
          res.status(200).json(docs);
        } else return res.status(404).json(err);
      }
    );
    userModel
      .findByIdAndUpdate( // find the user followed and update his follower array
        req.body.idToUnfollow,
        { $pull: { followers: req.params.id } },
        (err, docs) => {
          // if (!err) res.status(200).json(docs);
          if (err) return res.status(404).json(err);
        }
      )
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};


