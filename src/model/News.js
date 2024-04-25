import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      maxlengh: 200,
      minlength: 5,
    },
    content: {
      type: String,
      maxlength: 200,
      minlength: 5,
    },
    image: {
      type: String,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", NewsSchema);
export default News;
