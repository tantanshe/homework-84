import {ObjectId} from 'mongoose';

export interface UserFields {
  _id: ObjectId;
  username: string;
  password: string;
  token: string;
}

export interface TaskMutation {
  user: string;
  title: string;
  description?: string;
  status: 'new' | 'in_progress' | 'complete';
}