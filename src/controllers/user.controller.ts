import { UserService } from '../services/user.service';
import { User } from '../models';

import { Request, Response } from 'express';

//TODO: to improve later on
export class UserController {
  private userService = new UserService();

  constructor() {
    this.userService = new UserService();
  }
  // Get all users
  getAllUsers = (req: Request, res: Response): void => {
    const users = this.userService.getAllUsers();
    res.json(users);
  };

  // Get user by ID
  getUserById = (req: Request, res: Response): void => {
    const userId = req.params.id as string;
    const user = this.userService.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  // Create new user
  createUser = (req: Request, res: Response): void => {
    const newUser = req.body as User;
    const createdUser = this.userService.createUser(newUser);
    res.status(201).json(createdUser);
  };
  // Update user
  updateUser = (req: Request, res: Response): void => {
    const userId = req.params.id as string;
    const updatedUser = req.body as Partial<User>;
    const result = this.userService.updateUser(userId, updatedUser);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  // Delete user
  deleteUser = (req: Request, res: Response): void => {
    const userId = req.params.id as string;
    const result = this.userService.deleteUser(userId);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };
}
