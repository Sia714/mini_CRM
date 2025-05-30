const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("ERROR:", err));

app.use("/ai", require("./routes/ai"));
app.use("/customer", require("./routes/customer"));
app.use("/segment", require("./routes/segment"));

app.listen(5000, () => console.log("Server running on port 5000"));
