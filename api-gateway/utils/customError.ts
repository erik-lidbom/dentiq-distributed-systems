class CustomError extends Error {
    statusCode: number;
    details?: any;
  
    constructor(message: string, statusCode = 500, details?: any) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  
  export class ValidationError extends CustomError {
    constructor(message: string, details?: any) {
      super(message, 400, details);
    }
  }
  
  export class UnauthorizedError extends CustomError {
    constructor(message: string) {
      super(message, 401);
    }
  }
  
  export class ServiceError extends CustomError {
    constructor(message: string, details?: any) {
      super(message, 502, details);
    }
  }
  