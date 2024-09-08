export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface Task {
  user: string;
  title: string;
  description?: string;
  status: 'new' | 'in_progress' | 'complete';
}