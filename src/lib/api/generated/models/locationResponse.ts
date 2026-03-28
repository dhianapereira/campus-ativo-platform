/**
 * Compatibility model added after Orval generation.
 * The current OpenAPI spec references LocationResponse but does not emit it as a schema component.
 */

export interface LocationResponse {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
