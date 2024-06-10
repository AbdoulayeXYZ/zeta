import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectMongoDB from './configs/mongodb.config';
import userRoutes from './routes/user.route';
import { Request, Response } from 'express';
import cors from 'cors';


dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Utilisez CORS pour autoriser les requêtes cross-origin de localhost:4200
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
connectMongoDB();

app.use(cors({
    origin: 'http://localhost:4200'
}));

// Routes
app.use(`/${process.env.API_PREFIX}/users`, userRoutes);

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express server!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;

