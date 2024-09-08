import * as express from 'express';
import mongoose, {Types} from 'mongoose';
import Task from '../models/Task';
import auth, {RequestWithUser} from '../middleware/auth';
import {Response, NextFunction} from 'express';
import {TaskMutation} from '../types';

const tasksRouter = express.Router();

tasksRouter.post('/tasks', auth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }
    const taskData: TaskMutation = {
      user: req.user._id.toString(),
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };

    const task = new Task(taskData);
    await task.save();
    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

tasksRouter.get('/tasks', auth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found.'});
    }
    const tasks = await Task.find({user: req.user._id});
    res.send(tasks);
  } catch (error) {
    return next(error);
  }
});

tasksRouter.put('/tasks/:id', auth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }
    const task = await Task.findOne({_id: req.params.id, user: req.user._id});
    if (!task) {
      return res.status(404).send({error: 'Task not found or it is not yours'});
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    await task.save();
    res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

tasksRouter.delete('/tasks/:id', auth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }
    const taskId = new Types.ObjectId(req.params.id);
    const task = await Task.findOneAndDelete({_id: taskId, user: req.user._id});
    if (!task) {
      return res.status(403).send({error: 'Task not found or it is not yours'});
    }
    res.send({message: 'Task deleted successfully'});
  } catch (error) {
    return next(error);
  }
});

export default tasksRouter;
