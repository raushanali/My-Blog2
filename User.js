// User model for authentication
const users = []; // In-memory storage for users (will reset on server restart)

class User {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password; // Note: In production, use bcrypt for password hashing
    this.createdAt = new Date();
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findByUsername(username) {
    return users.find(user => user.username === username);
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static create(userData) {
    const user = new User(
      users.length + 1,
      userData.username,
      userData.email,
      userData.password
    );
    users.push(user);
    return user;
  }

  static getAll() {
    return users;
  }
}

module.exports = User;
