import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

// all routes go here
app.use("/api", routes);

// root health check
app.get('/', (req, res) => res.send('API running'));

export default app;
