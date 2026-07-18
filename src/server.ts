import express from "express";
import dotenv from "dotenv";

import chatRoutes from "./routes/chatRoutes.js";


dotenv.config({ path: ".env.local" });

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(chatRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})
