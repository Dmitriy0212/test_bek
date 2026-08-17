import { Schema, model } from "mongoose";
import { CATEGORIES } from "../constants/index.js";

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 48,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 200,
    },
    article: {
      type: String,
      required: true,
      minlength: 100,
      maxlength: 4000,
    },
    img: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "general",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Article = model("Article", articleSchema);
