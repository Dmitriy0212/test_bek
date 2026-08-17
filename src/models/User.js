import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      maxlength: 64,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    articlesAmount: {
      type: Number,
      default: 0,
    },
    savedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article",
        default: [],
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

export const User = model("User", userSchema);
