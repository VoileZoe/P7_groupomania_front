import { Content } from './content.model';

export class Thread {
  id: number | undefined;
  title: string | undefined;
  category_id!: number | undefined;
  content: Content | undefined;

  public constructor(init?: Partial<Thread>) {
    Object.assign(this, init);
  }
}

export class ThreadResponse {
  current!: number;
  perPage!: number;
  next: number | undefined;
  previous: number | undefined;
  threads!: Thread[];
}

export class CreateThreadResponse {
  id!: number;
  message!: string;
}
