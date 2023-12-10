export interface IMailPayload {
  title: string;
  html: string;
  callbackToken: string;
  buildPayload(frontendUrl: string): void;
}
