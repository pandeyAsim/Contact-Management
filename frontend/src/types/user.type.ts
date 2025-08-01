export type User = {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
  role: {
    id: number;
    title: string;
  };
};
