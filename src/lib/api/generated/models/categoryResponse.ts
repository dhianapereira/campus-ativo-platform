/**
 * Compatibility model added after Orval generation.
 * The current OpenAPI spec references CategoryResponse but does not emit it as a schema component.
 */

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
