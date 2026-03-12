//import dotenv from "dotenv";
import type { VercelRequest, VercelResponse } from "@vercel/node";

//dotenv.config();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "*");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "POST") {
    return response.status(405).end();
  }

  const payload = new URLSearchParams({
    client_id: process.env.WPCOM_CLIENT_ID!,
    client_secret: process.env.WPCOM_CLIENT_SECRET!,
    redirect_uri: process.env.WPCOM_REDIRECT_URI!,
    grant_type: "authorization_code",
    code: request.body.code,
  });

  const wpRes = await fetch("https://public-api.wordpress.com/oauth2/token", {
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
  });

  if (wpRes.ok) {
    const wpData = await wpRes.json();
    console.log("Successful request for WP.com token");
    response.status(200).json(wpData);
  } else {
    console.error("Request for token failed:", await wpRes.json());
    response.status(401).json({ message: "WP.com authentication failed" });
  }
}
