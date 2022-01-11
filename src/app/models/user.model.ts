export class User {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  role: string | undefined;
  status: string | undefined;
  password: string | undefined;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
