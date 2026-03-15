import { createNetlifyHandler } from "../../src/adapters/netlify/index.js";
import { composeAuthLoginHandler } from "../../src/app/composition/authLogin.js";

export const handler = createNetlifyHandler(composeAuthLoginHandler());

