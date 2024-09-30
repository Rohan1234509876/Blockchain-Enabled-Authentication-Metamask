import jwt from 'jsonwebtoken';

const secretKey = 'mysecretkey';  // Keep it consistent with login.js

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, secretKey);  // Use the same secret key
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      return res.json({ message: 'Expired' });
    } else {
      return res.json({ message: 'Valid' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
