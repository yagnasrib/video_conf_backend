const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const meetingRoutes = require("./routes/meetingRoutes");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({ origin: "https://video-conf-tau.vercel.app/", methods: ["GET", "POST"] }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

app.use("/api/meetings", meetingRoutes);

app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
