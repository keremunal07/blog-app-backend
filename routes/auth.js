//router ile endpointlerimizi oluşturacağız.
const router = require("express").Router();
// User modelimiz ile yeni bir user oluşturacağız.
const User = require("../models/User");

// bcrypt ile oluşturduğumuz şifreleri kriptolayacağız.
const bcrypt = require("bcrypt");

//jwt ile auth işlemlerimiz için bir token oluşturacağız. bu token sayesinde
//endpointlere bir middleware aracılığıyla asla auth olamadığımız müddetçe istek atamayacağız.
const jwt = require("jsonwebtoken");

// register

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err, message: "Error registering user" });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     !user && res.status(400).json({ message: "User not found" });

//     const validate = await bcrypt.compare(req.body.password, user.password);

//     if (!validate) {
//       res.status(400).json({ message: "Invalid password" });
//       return false;
//     }
//     const { password, ...userWithoutPassword } = user._doc;
//     jwt.sign(
//       { userWithoutPassword },
//       "secretkey",
//       { expiresIn: "1000s" },
//       (err, accessToken) => {
//         res.status(200).json({
//           accessToken,
//         });
//       }
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ err: err, message: "Error logging in user" });
//   }
// });

module.exports = router;
