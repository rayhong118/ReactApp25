import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}

export const verifyRecaptcha = onRequest({ cors: true }, async (req, res) => {
  const token = req.body.token;

  if (!token) {
    res.status(400).send({ error: "No token provided" });
    return;
  }

  try {
    // Access the secret from environment variables (set via Google Secret Manager or .env)
    const secretKey = process.env.RECAPTCHA_SECRET;

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    // Using axios with params for a cleaner request
    const response = await axios.post<RecaptchaResponse>(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: token,
      },
    });

    const data = response.data;

    if (data.success && data.score >= 0.5) {
      logger.info("reCAPTCHA passed", { score: data.score });
      res.status(200).send({
        success: true,
        score: data.score,
        message: "Human verified!",
      });
    } else {
      logger.warn("reCAPTCHA failed", { score: data.score, errors: data["error-codes"] });
      res.status(403).send({
        success: false,
        score: data.score,
        error: "Bot detected",
      });
    }
  } catch (error) {
    logger.error("Verification Error", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
