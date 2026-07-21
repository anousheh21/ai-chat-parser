import express from "express";
import dotenv from "dotenv";

import chatRoutes from "./routes/chatRoutes.js";


dotenv.config({ path: ".env.local" });

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(chatRoutes);

const port = 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
