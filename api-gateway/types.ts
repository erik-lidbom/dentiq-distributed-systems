// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

// Extend Express Request to Include User
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
