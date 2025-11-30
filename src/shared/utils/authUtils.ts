import jwt from 'jsonwebtoken';

export const generateToken = ({
  first_name,
  last_name,
  email,
  id,
}: {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
}) => {
  return jwt.sign(
    {
      first_name,
      last_name,
      email,
      id,
    },
    process.env.JWT_SECRET_KEY || 'test',
    {
      expiresIn: '7d',
    },
  );
};
