import jwt from 'jsonwebtoken';

export const generateToken = ({
  id,
  email,
}: {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
}) => {
  return jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_SECRET_KEY || 'test',
    {
      expiresIn: '7d',
    },
  );
};
