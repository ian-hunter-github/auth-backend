import type { AppHttpHandler } from "../http/types.js";
import { jsonOk } from "../../platform/http/response.js";
import { getHealth } from "../../services/healthService.js";

export const healthHandler: AppHttpHandler = async (request) => {
  const data = await getHealth();
  const response = jsonOk(200, request.requestId, data);

  return {
    statusCode: response.statusCode,
    headers: Object.fromEntries(
      Object.entries(response.headers ?? {}).map(([k, v]) => [k, String(v)])
    ),
    body: response.body ?? ""
  };
};

