import { Request, Response } from "express";
import ThreadService from "../1-service/ThreadService";
import threadsQueue from "../queue/threadsQueue";

export default new (class AuthController {
  findAll(req: Request, res: Response) {
    ThreadService.findAll(req, res);
  }
  findById(req: Request, res: Response) {
    ThreadService.findById(req, res);
  }
  addThread(req: Request, res: Response) {
    ThreadService.addThread(req, res);
  }
  updateThread(req: Request, res: Response) {
    ThreadService.updateThread(req, res);
  }
  deleteThread(req: Request, res: Response) {
    ThreadService.deleteThread(req, res);
  }
  findAllRedis(req: Request, res: Response) {
    ThreadService.findAllRedis(req, res);
  }

  uploadMultipleImage(req: Request, res: Response) {
    ThreadService.uploadMultipleImage(req, res);
  }
  addThreadQueue(req: Request, res: Response) {
    threadsQueue.addThreadQueue(req, res);
  }
})();
