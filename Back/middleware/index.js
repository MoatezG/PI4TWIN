const jwt = require('jsonwebtoken');

const logRequests = (req, res, next) => {
  console.log(`Request to ${req.path} with method ${req.method}`);
  next();
};

const authenticate = (req, res, next) => {
  console.log('AUTH HEADERS:', req.headers); // <-- Add this line
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};

module.exports = {
  logRequests,
  authenticate
};
