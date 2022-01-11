export class Content {
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
