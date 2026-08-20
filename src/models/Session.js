import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    // expires: 0 — TTL-індекс: MongoDB сам прибирає документ одразу після
    // цієї дати. Без нього хто просто закрив вкладку без /logout лишає
    // рядок сесії в базі назавжди (Atlas M0 — 512 МБ, вже під тиском)
    refreshTokenValidUntil: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Session = model("Session", sessionSchema);
