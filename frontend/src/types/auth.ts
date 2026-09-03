/**
 * Request payload sent to the authentication API when a user logs in.
 */
export interface LoginRequest {
  /** The user's email address. */
  email: string;
  /** The user's password. */
  password: string;
}

/**
 * Response returned by the authentication API after a successful login.
 */
export interface LoginResponse {
  /** JWT access token.
   * @type {string} */
  accessToken: string;
  /** JWT refresh token.
   * @type {string} */
  refreshToken: string;
}

/**
 * Request payload sent to the authentication API when a new user registers.
 */
export interface RegisterRequest {
  /** The user's display name. */
  name: string;
  /** The user's email address. */
  email: string;
  /** The user's desired password. */
  password: string;
}

/**
 * Authenticated user information used across the application.
 */
export interface User {
  /** Unique identifier of the user. */
  id: number;
  /** Display name of the user. */
  name: string;
  /** Email address of the user. */
  email: string;
}