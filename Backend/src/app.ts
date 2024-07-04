import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route';
import { Request, Response } from 'express';
import cors from 'cors';
import workspaceRoutes from './routes/workspace.route';
import connectMongoDB from './configs/mongodb.config';

dotenv.config();

connectMongoDB();

const PORT = process.env.PORT || 3000;
const app = express();

// Use CORS to allow cross-origin requests from localhost:4200
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use(`/${process.env.API_PREFIX}/users`, userRoutes);
app.use("/api", workspaceRoutes);

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express server!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
