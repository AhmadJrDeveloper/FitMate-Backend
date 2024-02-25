// custom.d.ts

import { Request } from 'express-serve-static-core';
import Admin from './models/adminModel';
declare module 'express-serve-static-core' {
  interface Request {
    admin?: Admin; // Use the Admin type from your model
  }
}
