import logger from '../utils/logger';

type User = {
  id: string;
  name: string;
  email: string;
};

export class UserService {
  // Simulated user data
  private users: Map<string, User> = new Map([
    ['1', { id: '1', name: 'Alice', email: 'alice@example.com' }],
    ['2', { id: '2', name: 'Bob', email: 'bob@example.com' }],
    ['3', { id: '3', name: 'Charlie', email: 'charlie@example.com' }],
  ]);

  /**
   * Get all users
   * @returns Array of users
   */
  getAllUsers() {
    logger.info('Fetching all users');
    return Array.from(this.users.values());
  }

  /**
   * Get a user by ID
   * @param id - User ID
   * @returns User object or undefined
   */
  getUserById(id: string) {
    logger.info(`Fetching user with ID: ${id}`);
    return this.users.get(id);
  }

  /**
   * Create a new user
   * @param user - User object
   * @returns Created user object
   */
  createUser(user: User) {
    logger.info(`Creating user with ID: ${user.id}`);
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Update an existing user
   * @param id - User ID
   * @param updatedUser - Updated user object
   * @returns Updated user object or undefined
   */
  updateUser(id: string, updatedUser: { name?: string; email?: string }) {
    const user = this.getUserById(id);
    logger.info(`Updating user with ID: ${id}`);

    if (user) {
      Object.assign(user, updatedUser);
      return user;
    }
    logger.warn(`User with ID: ${id} not found for update`);
    return undefined;
  }

  /**
   * Delete a user by ID
   * @param id - User ID
   * @returns Boolean indicating success
   */
  deleteUser(id: string) {
    const index = Array.from(this.users.keys()).findIndex(
      (userId) => userId === id,
    );
    logger.info(`Deleting user with ID: ${id}`);
    if (index !== -1) {
      this.users.delete(id);
      return true;
    }
    logger.warn(`User with ID: ${id} not found`);
    return false;
  }
}
