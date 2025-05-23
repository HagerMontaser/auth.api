import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessGuard extends AuthGuard('AccessStrategy') {}
// This guard uses the JWT strategy to authenticate requests.
// It will check for a valid JWT token in the request headers and validate it using the JWT strategy.
// If the token is valid, the request will be allowed to proceed to the next handler.
// If the token is invalid or missing, an error will be thrown and the request will be denied.
