export interface PostDTO {
  id: string;
  title: string;
  body: string;
  authorId: string;
  isDraft: boolean;
  dateCreated: Date;
  lastUpdated: Date;
}
