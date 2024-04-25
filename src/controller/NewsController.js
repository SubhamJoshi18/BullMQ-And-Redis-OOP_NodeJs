import { NewsService } from "../service/news.service.js";

export class NewsController {
  static async create(req, res) {
    const user = req.user;
    const body = req.body;
    return await NewsService.createService(req, res, user, body);
  }

  static async viewAllNews(req, res) {
    return await NewsService.viewAllNewsService(req, res);
  }

  static async viewNewsId(req, res) {
    const { id } = req.params;
    return await NewsService.viewNewsById(res, id);
  }
  static async AddImage(req, res) {
    const { id } = req.params;
    return await NewsService.UploadImage(req, res, id);
  }

  static async UpdateNews(req, res) {
    const { id } = req.params;
    const body = req.body;
    return await NewsService.UpdateNewsService(res, id, body);
  }
  static async DeleteNews(req, res) {
    const { id } = req.params;
    return await NewsService.DeleteNewsService(res, id);
  }

  static async RemoveNews(req, res) {}
}
