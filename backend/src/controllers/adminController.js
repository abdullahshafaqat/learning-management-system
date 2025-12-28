import * as adminService from '../services/adminService.js';

/**
 * Get all users
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await adminService.getAllUsers(role);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Update user role
 * PUT /api/users/:id/role
 * Body: { role: 'teacher' | 'student' }
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Basic validation
    if (!role) {
      return res.status(400).json({ success: false, error: 'Role is required' });
    }

    const updatedUser = await adminService.updateUserRole(id, role);
    res.json({ success: true, message: 'User role updated', user: { _id: updatedUser._id, role: updatedUser.role } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * Block/Unblock user
 * PUT /api/users/:id/block
 * Body: { isBlocked: true | false }
 */
export const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({ success: false, error: 'isBlocked (boolean) is required' });
    }

    const updatedUser = await adminService.toggleUserBlock(id, isBlocked);
    res.json({ 
      success: true, 
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, 
      user: { _id: updatedUser._id, isBlocked: updatedUser.isBlocked } 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
