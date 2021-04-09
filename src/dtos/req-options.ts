export class ReqOptions {
  body?: any
  headers?: any
  searchParams?: any
  basicAuth?: {
    username: string
    password: string
  }
  p12Auth?: {
    pfx: Buffer
    passphrase: string
  }
  timeout?: number
  retry?: any
}
