import { createNetlifyHandler } from "../../src/adapters/netlify/index.js";
import { composeHealthHandler } from "../../src/app/composition/health.js";

export const handler = createNetlifyHandler(composeHealthHandler());

