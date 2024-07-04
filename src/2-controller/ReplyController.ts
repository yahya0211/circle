import { Request, Response } from "express";
import ReplyService from "../1-service/ReplyService";

export default new (class AuthController {
  addReply(req: Request, res: Response) {
    ReplyService.addReply(req, res);
  }
  updateReply(req: Request, res: Response) {
    ReplyService.updateReply(req, res);
  }
  deleteReply(req: Request, res: Response) {
    ReplyService.deleteReply(req, res);
  }
})();
