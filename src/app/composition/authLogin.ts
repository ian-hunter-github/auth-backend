import { authLoginHandler } from "../handlers/authLoginHandler.js";

export function composeAuthLoginHandler() {
  return authLoginHandler;
}

