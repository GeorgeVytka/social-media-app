import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

//for path for dir
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";

//middleware are function that run inbtween
/* CONFIGURATION*/
// grb the file url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
//helps to protect Node. js Express apps from common security threats such as Cross-Site Scripting (XSS) and click-jacking attacks.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
//HTTP request logger middleware for node.js
app.use(morgan("common"));
//Express body-parser is an npm module used to process data sent in an HTTP request body
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//set the dir where we keep the assests like images
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE*/

//an npm package that makes it easy to handle file uploads.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES*/
app.post("/auth/register", upload.single("picture"), register);

/* MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
