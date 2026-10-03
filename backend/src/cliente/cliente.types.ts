export interface ClienteToken {
  sub: number;
  email: string;
  role: 'cliente' | 'admin';
}
