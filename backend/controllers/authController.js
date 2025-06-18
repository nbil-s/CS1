const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'patient' // default
  });

  res.json({ message: 'User created', user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ token, role: user.role });
};
