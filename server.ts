import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer, Server } from 'http';
import connect from './congif/db';
import AdminRouter from './routes/adminRoute';
import CategoryRouter from './routes/categoryRoute';
import ExerciseRouter from './routes/exerciseRoute';
import UserRouter from './routes/userRoute';
import GoalRouter from './routes/goalRoute';
import ScheduleRouter from './routes/scheduleRoute';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`//${req.method} ${req.path} `);
    next();
});

const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  throw new Error('Environment variable CONNECTION_STRING is not set');
}

(async () => {
  try {
    await connect(connectionString);
    console.log('DB Connected');
  } catch (err) {
    console.error('Error connecting to DB', err);
  }
})();


const httpServer: Server = createServer(app);
httpServer.listen(process.env.PORT, () => {
  console.log(`Server starting on port ${process.env.PORT}`);
}).on('error', (err: Error) => {
  console.error('Something went wrong', err);
});


app.use('/admins',AdminRouter);
app.use('/categories',CategoryRouter);
app.use('/exercises', ExerciseRouter);
app.use('/users', UserRouter);
app.use('/goals', GoalRouter);
app.use('/schedules', ScheduleRouter);

