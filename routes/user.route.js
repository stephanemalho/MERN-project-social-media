const router = require('express').Router(); //call express router
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');


//auth concerne l'authentification du user
router.post('/register', authController.signUp); 
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

// user DataBase
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

module.exports = router;

// reprendre à 1H00