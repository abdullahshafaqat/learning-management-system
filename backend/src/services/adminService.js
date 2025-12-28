import User from '../models/User.js';

/**
 * Get all users, optionally filtered by role
 * @param {string} roleFilter - Optional role to filter by
 * @returns {Promise<Array>} List of users
 */
export const getAllUsers = async (roleFilter) => {
  const query = {};
  if (roleFilter) {
    query.role = roleFilter;
  }
  // Exclude passwords
  return await User.find(query).select('-password');
};

/**
 * Update user role (cannot change admin role or promote to admin via this method if strictly interpreted, 
 * but per prompt instructions: "Admin cannot promote users to admin". 
 * So we block setting role to 'admin' here for safety, unless we want to allow it manually. 
 * Prompt says: "Change user role: student -> teacher, teacher -> student". "Admin cannot promote users to admin".
 */
export const updateUserRole = async (userId, newRole) => {
  if (newRole === 'admin') {
    throw new Error('Cannot promote to admin via this endpoint.');
  }

  if (!['student', 'teacher'].includes(newRole)) {
    throw new Error('Invalid role. Allowed: student, teacher');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Prevent modifying an existing admin's role via this generic method (safety)
  if (user.role === 'admin') {
    throw new Error('Cannot change role of an admin user.');
  }

  user.role = newRole;
  await user.save();
  return user;
};

/**
 * Block or unblock a user
 * @param {string} userId 
 * @param {boolean} isBlocked 
 */
export const toggleUserBlock = async (userId, isBlocked) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.role === 'admin') {
    throw new Error('Cannot block an admin.');
  }

  user.isBlocked = isBlocked;
  await user.save();
  return user;
};
