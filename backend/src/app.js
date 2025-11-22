import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import mortgageRoutes from "./routes/mortgageRoutes.js";

const devOrigins = ['http://localhost:5173']; // Vite default

const app = express();

app.use(cors({
    origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow curl/postman
    if (devOrigins.includes(origin) || origin.startsWith('http://192.168.')) return cb(null, true);
    cb(null, true); // or restrict to known origins
  },
  credentials: true
}));

app.use(express.json());

// all routes go here
app.use("/api", routes);

// root health check
app.get('/', (req, res) => res.send('API running'));

app.use("/api/mortgage", mortgageRoutes);

export default app;
