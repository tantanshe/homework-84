import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routers/users';
import tasksRouter from './routers/tasks';

const app = express();
const port = 8000;

app.use(express.json());
app.use('/', usersRouter);
app.use('/', tasksRouter);

const run = async () => {
  await mongoose.connect('mongodb://localhost');

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);