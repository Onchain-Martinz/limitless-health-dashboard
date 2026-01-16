import axios from "axios";
import type { Handler } from "@netlify/functions";

type FeesPoint = {
  date: string;
  dailyFees: number;
  totalFees: number;
};

type FeesResponse = {
  ok: true;
  protocol: string;
  source: "defillama";
  points: FeesPoint[];
};

type ErrorResponse = {
  ok: false;
  error: string;
};

const PROTOCOL = "limitless-exchange";
const FEES_URL = `https://api.llama.fi/summary/fees/${PROTOCOL}?dataType=dailyFees`;
const REQUEST_TIMEOUT_MS = 10_000;

export const handler: Handler = async () => {
  try {
    const response = await axios.get(FEES_URL, { timeout: REQUEST_TIMEOUT_MS });
    const data = response.data?.data ?? response.data;
    const raw = data?.totalDataChart;

    if (!Array.isArray(raw)) {
      const keys = data && typeof data === "object" ? Object.keys(data) : [];
      throw new Error(
        `Unexpected response shape from DefiLlama. Available keys: ${keys.join(
          ", "
        )}`
      );
    }

    const points: FeesPoint[] = [];
    let runningTotal = 0;

    for (const entry of raw) {
      if (!Array.isArray(entry) || entry.length < 2) {
        throw new Error("Invalid fees entry from DefiLlama");
      }

      const [unixSeconds, dailyFees] = entry;

      if (typeof unixSeconds !== "number" || typeof dailyFees !== "number") {
        throw new Error("Invalid fees values from DefiLlama");
      }

      runningTotal += dailyFees;

      points.push({
        date: new Date(unixSeconds * 1000).toISOString().slice(0, 10),
        dailyFees,
        totalFees: runningTotal,
      });
    }

    const body: FeesResponse = {
      ok: true,
      protocol: PROTOCOL,
      source: "defillama",
      points,
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          url: FEES_URL,
          status: error.response.status,
          statusText: error.response.statusText,
        }),
      };
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    const body: ErrorResponse = { ok: false, error: message };

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  }
};
