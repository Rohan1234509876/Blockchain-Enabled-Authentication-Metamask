import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';

const secretKey = 'mysecretkey';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { signedMessage, address, nonce } = req.body;
  console.log({ signedMessage, address, nonce }); // Log inputs for debugging

  try {
    // Verify the signed message using ethers v6
    const recoveredAddress = ethers.verifyMessage(nonce, signedMessage); // Use ethers.verifyMessage
    console.log("Recovered Address:", recoveredAddress); // Log recovered address

    if (recoveredAddress !== address) {
      return res.status(401).json({ error: 'Invalid address' });
    }

    // Generate JWT token
    const token = jwt.sign({ address }, secretKey, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    return res.status(500).json({ error: 'Server error' });
  }
}

export default handler;





