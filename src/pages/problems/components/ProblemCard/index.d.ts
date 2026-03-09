export interface IProps {
  id: string;
  /** Slug for detail URL; backend GET problem uses slug */
  slug: string;
  title: string;
  location: string;
  description: string;
  badgeId: string;
}
