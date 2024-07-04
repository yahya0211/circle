import { Request, Response } from "express";
import UserService from "../1-service/UserService";

export default new (class UserController {
  findAll(req: Request, res: Response) {
    UserService.findAll(req, res);
  }

  findById(req: Request, res: Response) {
    UserService.findById(req, res);
  }

  findByName(req: Request, res: Response) {
    UserService.findByName(req, res);
  }

  updateWithoutImage(req: Request, res: Response) {
    UserService.updateWithoutImage(req, res);
  }

  uploadProfilePicture(req: Request, res: Response) {
    UserService.uploadProfilePicture(req, res);
  }

  getSugestedUser(req: Request, res: Response) {
    UserService.getSugestedUser(req, res);
  }
  editProfile(req: Request, res: Response) {
    UserService.editProfile(req, res);
  }

  delete(req: Request, res: Response) {
    UserService.delete(req, res);
  }
})();
