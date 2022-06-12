// express üzerinden bir app ayağa kaldırıyoruz.
const express = require("express");
const app = express();
const dotenv = require("dotenv");
//mongoose bir nosql veritabanı kütüphanesidir. db'ye bağlanmak için gerekli.
const mongoose = require("mongoose");

//burada çağırdıklarımız bizim endpointlerimize ulaşmamızı sağlıyor.
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const categoriesRoute = require("./routes/categories");

//image upload için multer kütüphanesini çağırıyoruz.
const multer = require("multer");

// path image upload ederken dosya yolunu belirler
const path = require("path");

//burada çağırdığmız middleware bizim jwt auth için yazdığımız fonksiyon.
const verifyToken = require("./middleware/verifyToken");

//dotenv ile environmentlarımızı çağırıyoruz.
dotenv.config();

// express bodyparser ile body'yi parse ediyoruz.
app.use(express.json());

//image upload için imageın yolunu belirliyoruz.
app.use("/images", express.static(path.join(__dirname, "/images")));

//burada kendimize ait olan databaseimize bağlanıyoruz.
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//bu kısımda multer kütüphanesi ile image upload ediyoruz.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

//app'i ayağa kaldırırken routelarımızı belirtiyoruz.
//serverimize gelen istekleri yönetmek için kullandığımız routelar
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/categories", categoriesRoute);

// app'i ayağa kaldırıyoruz.
app.listen(process.env.PORT, () => {
  console.log("Server is running on port: " + process.env.PORT);
});
