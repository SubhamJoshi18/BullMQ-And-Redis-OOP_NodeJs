import logger from "../config/logger.js";
import client from "../config/redisConfig.js";
import News from "../model/News.js";
import User from "../model/User.js";
import {
  generateUniqueName,
  imageValidator,
  removeImage,
} from "../utils/helper.js";
import { createNewsValdiator } from "../validation/NewsValidation.js";
import vine from "@vinejs/vine";
export class NewsService {
  static async createService(req, res, user, body) {
    try {
      const validator = vine.compile(createNewsValdiator);
      const payload = await validator.validate(body);
      console.log(user);
      const checkUser = await User.findOne({ _id: user.userid });
      if (!checkUser) {
        return res.status(403).json({
          status: 403,
          message: "User is not Authorized",
        });
      }

      const savedNews = new News({
        user_id: user.userid,
        title: payload.title,
        content: payload.content,
      });

      const entry = await savedNews.save();
      if (entry.get("title") !== null || undefined) {
        return res.status(201).json({
          status: 201,
          message: "Success",
          data: entry,
        });
      }
    } catch (err) {
      logger.error(err.message);
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  }

  static async viewAllNewsService(req, res) {
    try {
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 1;
      if (page < 0) {
        page = 1;
      }
      if (page < 0 || limit > 100) {
        limit = 10;
      }
      const skip = (page - 1) * limit;
      const totalNews = await News.find({}).countDocuments();
      const totalPage = Math.ceil(totalNews / limit);

      const allNews = await News.find({})
        .populate({
          path: "user_id",
          select: "name",
        })
        .limit(limit)
        .skip(skip);
      const aggregation = await News.aggregate([
        {
          $group: {
            _id: null,
            totalNews: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            totalNews: 1,
          },
        },
      ]);
      if (allNews.length > 0) {
        return res.status(201).json({
          status: 201,
          message: "All News",
          currentPage: page,
          totalpage: totalPage,
          AvailAble_News: aggregation,
          data: allNews,
        });
      }
    } catch (err) {
      logger.error(err.message);
      console.log(err);
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  }

  static async viewNewsById(res, id) {
    try {
      const cacheValue = await client.get("news");
      if (cacheValue) {
        return res.status(201).json({
          status: 201,
          message: "Redis Database Fetching...",
          data: JSON.parse(cacheValue),
        });
      }
      const checkNews = await News.findOne({ _id: id }).populate({
        path: "user_id",
        select: "name",
      });
      if (checkNews.get("title").length === 0) {
        return res.status(400).json({
          message: "News Is Not Available",
        });
      }
      await client.set("news", JSON.stringify(checkNews));
      await client.expire("news", 30);
      return res.status(201).json({
        status: 201,
        message: "News ",
        data: checkNews,
      });
    } catch (err) {
      logger.error(err.message);
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  }

  static async UploadImage(req, res, id) {
    const checkNews = await News.findOne({ _id: id });
    if (checkNews.get("title").length === 0) {
      return res.status(401).json({
        status: 401,
        message: "News Does Not Exists",
      });
    }
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          error: 400,
          message: "Image Cannot Be Null, Please Insert Image",
        });
      }
      const image = req.files.image;
      const checkImage = imageValidator(image.size, image.mimetype);
      if (checkImage !== null) {
        return res.status(401).json({
          error: {
            image: checkImage,
          },
        });
      }

      const imageExt = image.name.split(".");
      const imagePath = generateUniqueName() + "." + imageExt[1];
      const uploadPath = process.cwd() + "/src/public/newsImage/" + imagePath;

      image.mv(uploadPath, (err) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }
      });

      await News.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            image: `http://localhost:8000/${imagePath}`,
          },
        }
      );

      return res.status(201).json({
        status: 201,
        message: "Image Uploaded SuccessFully",
      });
    } catch (err) {
      logger.error(err.message);
      if (err instanceof Error) {
        return res.status(500).json({
          message: "INTERNAL SERVER ERROR",
        });
      }
    }
  }

  static async UpdateNewsService(res, id, body) {
    const checkNews = await News.findOne({ _id: id });
    if (!checkNews || checkNews.get("title").length === 0) {
      return res.status(401).json({
        message: "News Is Not Available",
      });
    }
    try {
      const validator = vine.compile(createNewsValdiator);
      const payload = await validator.validate(body);
      const response = await News.updateOne(
        { _id: id },
        {
          $set: {
            title: payload.title,
            content: payload.content,
          },
        },
        {
          new: true,
        }
      );
      return res.status(201).json({
        status: 201,
        message: "News Has Been Updated SuccessFully",
        response: response,
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  }

  static async DeleteNewsService(res, id) {
    const checkNews = await News.findOne({ _id: id });
    if (!checkNews || checkNews.get("title").length === 0) {
      return res.status(401).json({
        message: "News Is Not Available",
      });
    }
    try {
      removeImage(checkNews.image);
      await News.deleteOne({ _id: id });
      return res.status(200).json({
        message: `News Has Been Deleted`,
      });
    } catch (err) {
      logger.error(err.message);
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }
    }
  }
}
