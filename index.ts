import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/token", async (request, response) => {
  const payload = new URLSearchParams();
  payload.set("client_id", process.env.WPCOM_CLIENT_ID!);
  payload.set("client_secret", process.env.WPCOM_CLIENT_SECRET!);
  payload.set("redirect_uri", process.env.WPCOM_REDIRECT_URI!);
  payload.set("grant_type", "authorization_code");
  payload.set("code", request.body.code);
  const wpRes = await fetch("https://public-api.wordpress.com/oauth2/token", {
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
  });
  if (wpRes.ok) {
    const wpData = await wpRes.json();
    response.json(wpData);
  } else {
    response.status(401);
    console.log(await wpRes.json());
    response.json({ message: "WP.com authentication failed" });
  }
});

app.listen(80);
