const dotenv = require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connectDB");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
mongoose.set('strictQuery', false);
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const errorHandler = require("./middleware/errorMiddleware")

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser())
-app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://www.google.com/'],
    credentials: true,
  })
);
//Route
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)

app.get("/", (req, res) => {
  res.send("Home page");
});

// Error Middleware

app.use(errorHandler)
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));