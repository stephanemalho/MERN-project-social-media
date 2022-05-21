const express = require("express");//importation de express
const bodyParser = require("body-parser"); // importation de body-parser
const cookieParser = require("cookie-parser"); // importation de cookie-parser
const userRoutes = require("./routes/user.route"); //importation de userRoutes
const postRoutes = require("./routes/post.route"); //importation de postRoutes
require("dotenv").config({ path: "./config/.env" }); //importation de dotenv
require("./config/db"); //importation de la base de données
const { checkUser , requireAuth } = require("./middleware/auth.middleware"); //import de checkUser
const cors = require("cors"); //import de cors

const app = express(); //création de l'application

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId','Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methode': ['GET','HEAD','PUT','POST','DELETE','PATCH'],
  'preflightContinue': false
}

app.use(cors(corsOptions)); //utilisation de cors
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended:true})); // support encoded bodies
app.use(cookieParser()); // support cookie

// jwt
app.get('*', checkUser); // middleware de checkUser
app.get('/jwtid',requireAuth, (req, res) => {
    res.status(200).send(res.locals.user)
})

// routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// serveur
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

