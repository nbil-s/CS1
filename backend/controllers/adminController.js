const { User, Appointment, Queue, Notification } = require('../models');
const bcrypt = require('bcryptjs');

// Middleware to verify JWT token and admin role
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Add new staff member (doctor or receptionist)
exports.addStaffMember = async (req, res) => {
  try {
    verifyAdminToken(req, res, async () => {
      const { 
        name, 
        email, 
        password, 
        role, 
        phone, 
        specialization, 
        licenseNumber, 
        department 
      } = req.body;

      // Validate required fields
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
      }

      // Validate role
      if (!['doctor', 'receptionist'].includes(role)) {
        return res.status(400).json({ message: 'Role must be either doctor or receptionist' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Validate role-specific fields
      if (role === 'doctor' && !specialization) {
        return res.status(400).json({ message: 'Specialization is required for doctors' });
      }

      if (role === 'receptionist' && !department) {
        return res.status(400).json({ message: 'Department is required for receptionists' });
      }

      // Hash password
      const passwordHash = bcrypt.hashSync(password, 10);

      // Create user with role-specific data
      const userData = {
        name,
        email,
        passwordHash,
        role,
        phone,
        isActive: true,
        createdBy: req.user.id
      };

      // Add role-specific fields
      if (role === 'doctor') {
        userData.specialization = specialization;
        userData.licenseNumber = licenseNumber;
      } else if (role === 'receptionist') {
        userData.department = department;
      }

      const user = await User.create(userData);

      res.status(201).json({
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          specialization: user.specialization,
          licenseNumber: user.licenseNumber,
          department: user.department,
          isActive: user.isActive
        }
      });
    });
  } catch (error) {
    console.error('Add staff member error:', error);
    res.status(500).json({ message: 'Failed to add staff member', error: error.message });
  }
};

// Get all staff members (doctors and receptionists)
exports.getStaffMembers = async (req, res) => {
  try {
    verifyAdminToken(req, res, async () => {
      const { role, isActive } = req.query;
      
      const whereClause = {
        role: ['doctor', 'receptionist']
      };

      if (role) {
        whereClause.role = role;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const staff = await User.findAll({
        where: whereClause,
        attributes: { exclude: ['passwordHash'] },
        order: [['createdAt', 'DESC']]
      });

      res.json({ staff });
    });
  } catch (error) {
    console.error('Get staff members error:', error);
    res.status(500).json({ message: 'Failed to get staff members', error: error.message });
  }
};

// Update staff member
exports.updateStaffMember = async (req, res) => {
  try {
    verifyAdminToken(req, res, async () => {
      const { userId } = req.params;
      const { 
        name, 
        email, 
        phone, 
        specialization, 
        licenseNumber, 
        department, 
        isActive 
      } = req.body;

      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      if (!['doctor', 'receptionist'].includes(user.role)) {
        return res.status(400).json({ message: 'Can only update staff members' });
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      // Update user data
      const updateData = {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        isActive: isActive !== undefined ? isActive : user.isActive
      };

      // Add role-specific fields
      if (user.role === 'doctor') {
        updateData.specialization = specialization || user.specialization;
        updateData.licenseNumber = licenseNumber || user.licenseNumber;
      } else if (user.role === 'receptionist') {
        updateData.department = department || user.department;
      }

      await user.update(updateData);
      
      res.json({ 
        message: 'Staff member updated successfully', 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          specialization: user.specialization,
          licenseNumber: user.licenseNumber,
          department: user.department,
          isActive: user.isActive
        }
      });
    });
  } catch (error) {
    console.error('Update staff member error:', error);
    res.status(500).json({ message: 'Failed to update staff member', error: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    verifyAdminToken(req, res, async () => {
      const users = await User.findAll({
        attributes: { exclude: ['passwordHash'] },
        order: [['createdAt', 'DESC']]
      });

      res.json({ users });
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    verifyAdminToken(req, res, async () => {
      const { userId } = req.params;
      const { name, email, role, active } = req.body;

      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent admin from deleting themselves
      if (user.id === req.user.id && role !== 'admin') {
        return res.status(400).json({ message: 'Cannot change your own role' });
      }

      await user.update({ name, email, role, active });
      
      res.json({ 
        message: 'User updated successfully', 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          active: user.active 
        } 
      });
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    verifyAdminToken(req, res, async () => {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent admin from deleting themselves
      if (user.id === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      // Check if user has related data
      const appointmentCount = await Appointment.count({
        where: { 
          [require('sequelize').Op.or]: [
            { patientId: userId },
            { doctorId: userId }
          ]
        }
      });

      if (appointmentCount > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete user with existing appointments. Consider deactivating instead.' 
        });
      }

      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Get system statistics (admin only)
exports.getSystemStats = async (req, res) => {
  try {
    verifyAdminToken(req, res, async () => {
      const [
        totalUsers,
        totalPatients,
        totalDoctors,
        totalReceptionists,
        totalAppointments,
        pendingAppointments,
        totalQueueEntries,
        activeQueueEntries
      ] = await Promise.all([
        User.count(),
        User.count({ where: { role: 'patient' } }),
        User.count({ where: { role: 'doctor' } }),
        User.count({ where: { role: 'receptionist' } }),
        Appointment.count(),
        Appointment.count({ where: { status: 'pending' } }),
        Queue.count(),
        Queue.count({ where: { status: ['waiting', 'called'] } })
      ]);

      // Get recent activity
      const recentAppointments = await Appointment.findAll({
        include: [
          { model: User, as: 'patient', attributes: ['name'] },
          { model: User, as: 'doctor', attributes: ['name'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      const recentUsers = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      res.json({
        stats: {
          totalUsers,
          totalPatients,
          totalDoctors,
          totalReceptionists,
          totalAppointments,
          pendingAppointments,
          totalQueueEntries,
          activeQueueEntries
        },
        recentActivity: {
          appointments: recentAppointments,
          users: recentUsers
        }
      });
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ message: 'Failed to get system stats', error: error.message });
  }
};

// Get audit logs (admin only)
exports.getAuditLogs = async (req, res) => {
  try {
    verifyAdminToken(req, res, async () => {
      // For now, return recent user activities
      // In a real system, you'd have a separate AuditLog model
      const recentActivities = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
        order: [['updatedAt', 'DESC']],
        limit: 20
      });

      const auditLogs = recentActivities.map(user => ({
        id: user.id,
        action: 'User Activity',
        details: `${user.name} (${user.role}) - Last updated: ${user.updatedAt}`,
        timestamp: user.updatedAt
      }));

      res.json({ auditLogs });
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Failed to get audit logs', error: error.message });
  }
}; 