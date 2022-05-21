const mongoose = require("mongoose"); // importation de mongoose
const { isEmail } = require("validator"); // npm i validator
const bcrypt = require("bcrypt"); // npm i bcrypt

// déclaration du schema
const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 33,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"], // validation de l'email
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio: {
      type: String,
      maxlength: 1024,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// déclaration du model de cryptage du mot de passe
userSchema.pre("save",async function (next) {
  const salt = await bcrypt.genSalt(10); //salage du mot de passe
  this.password = await bcrypt.hash(this.password, salt); // générer le hash du mot de passe
  next();
});

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password,user.password);
    if (auth) {
      return user;
    } 
    throw new Error("Invalid password");
  }
  throw new Error("Invalid email");
};

// déclaration du model
const userModel = mongoose.model("User", userSchema);
// export du model
module.exports = userModel;