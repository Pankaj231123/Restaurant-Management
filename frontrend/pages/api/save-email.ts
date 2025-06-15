import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const filePath = path.join(process.cwd(), 'public', 'email.txt');
    const line = `Email : ${email}\n`;

    try {
      console.log('Saving to:', filePath);
      fs.appendFileSync(filePath, line, 'utf8');
      return res.status(200).json({ message: 'Email saved' });
    } catch (err) {
      console.error('Error writing to file:', err);
      return res.status(500).json({ message: 'Failed to save email' });
    }
  } else {
    console.warn('Wrong method:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
