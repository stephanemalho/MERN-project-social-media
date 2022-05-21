module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo")) errors.pseudo = "Pseudo already used";

  if (err.message.includes("email"))
    errors.email = "The email seems not correct";

  if (err.message.includes("password"))
    errors.password = "Password must be at least 6 characters";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "Pseudo already used";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Email already used";

  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email")) errors.email = "The email unknown";

  if (err.message.includes("password"))
    errors.password = "Password must countain a mistake";

  return errors;
};

module.exports.uploadErrors = (err) => {
  let errors = { format:"", maxSize: ""};

  if (err.message.includes('invalid file'))
    errors.format = "Format incompatabile";

  if (err.message.includes('max size'))
    errors.maxSize = "Le fichier dépasse 500ko";

  return errors
}
