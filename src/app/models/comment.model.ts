import { Content } from './content.model';

export class Comment {
  id!: number;
  thread_id!: number;
  user_id!: string;
  content_type_id!: number;
  content_text!: string;
  status!: string;
  date_creation!: string;
  date_update!: string | null;

  public constructor(init?: Partial<Content>) {
    Object.assign(this, init);
  }
}

export class CommentResponse {
  current!: number;
  perPage!: number;
  next: number | undefined;
  previous: number | undefined;
  comments!: Comment[];
}

export class CreateCommentResponse {
  id!: number;
  message!: string;
}
