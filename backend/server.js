const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
