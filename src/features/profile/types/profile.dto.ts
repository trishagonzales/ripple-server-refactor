export interface ProfileDTO {
  id: string;
  username: string;
  name?: string;
  bio?: string;
  location?: string;
  dateCreated: Date;
  avatarUrl?: string;
}
