// declare module 'express-session' {
//   interface SessionData {
//     refreshToken: string;
//   }
// }

declare namespace Express {
  namespace session {
    interface SessionData {
      refreshToken: string;
    }
  }
}
