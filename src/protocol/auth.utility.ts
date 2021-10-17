import { encodeAuthStatus } from "./auth";

export function returnAuthSuccess() {
  return encodeAuthStatus({
    code: {
      low: 0,
      high: 0,
      unsigned: true,
    },
    message: "auth success",
  });
}

export function returnAuthFail() {
  return encodeAuthStatus({
    code: {
      low: 1,
      high: 0,
      unsigned: true,
    },
    message: "auth fail",
  });
}
