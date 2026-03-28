/**
 * Compatibility model added after Orval generation.
 * The frontend still consumes UserResponse semantics while the current spec only emits UserProfileResponse.
 */

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  position: string;
  role?: string;
  isActive?: boolean;
}
