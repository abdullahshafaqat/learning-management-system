import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/token.js';

export const register = async (username, email, password, role = 'student') => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Security: Only allow student, teacher, or admin roles
  const allowedRoles = ['student', 'teacher', 'admin'];
  let safeRole = allowedRoles.includes(role) ? role : 'student';

  // Singleton Admin Check: Only one admin allowed
  if (safeRole === 'admin') {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      safeRole = 'student'; // Fallback to student if admin already exists
    }
  }

  const hashedPassword = await hashPassword(password);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: safeRole,
  });

  await user.save();
  return { token: generateToken(user._id, user.role), user };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return { token: generateToken(user._id, user.role), user };
};
