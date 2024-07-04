import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { register, login } from "../utils/AuthUtils";

const prisma = new PrismaClient();

export default new (class AuthService {
  private readonly AuthRepository = prisma.users;

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;
      const { error } = register.validate(body);
      if (error) return res.status(400).json({ message: error.message });

      const isMailRegistered = await this.AuthRepository.count({
        where: { email: body.email },
      });
      if (isMailRegistered > 0) return res.status(400).json({ message: "Email already registered!" });

      const hashPassword = await bcrypt.hash(body.password, 10);

      const id = uuidv4();
      const usernameUUIDpart = id.substring(0, 8).replace(/-/g, " ");
      const uconvert = `user_${usernameUUIDpart}_${body.fullname.replace(/\s/g, "_")}`;

      const Auth = await this.AuthRepository.create({
        data: {
          username: uconvert,
          fullname: body.fullname,
          email: body.email,
          password: hashPassword,
          bio: "",
          photo_profile: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
          created_at: new Date(),
        },
      });

      return res.status(201).json({
        code: 201,
        status: "Success",
        message: "Registration success",
        data: Auth,
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ message: error });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;
      const { value, error } = login.validate(body);
      if (error) return res.status(400).json({ message: error.message });

      const isMailRegistered = await this.AuthRepository.findFirst({
        where: { email: body.email },
      });
      if (!isMailRegistered) return res.status(409).json({ message: "Email isn't Registered" });

      const isMatchPassword = await bcrypt.compare(value.password, isMailRegistered.password);
      if (!isMatchPassword) return res.status(409).json({ message: "Incorrect Password!" });

      const User = {
        id: isMailRegistered.id,
        username: isMailRegistered.username,
        fullname: isMailRegistered.fullname,
        profile_picture: isMailRegistered.photo_profile,
        bio: isMailRegistered.bio,
      };

      const token = jwt.sign({ User }, "SECRET_KEY", { expiresIn: 9999999 });

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Login success",
        token,
      });
    } catch (error) {
      return res.status(501).json({ message: error });
    }
  }

  async check(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.AuthRepository.findUnique({
        where: {
          id: res.locals.loginSession.User.id,
        },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "User have token",
      });
    } catch (error) {
      return res.status(501).json({ message: error });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      localStorage.clear();

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Logout success",
      });
    } catch (error) {
      return res.status(500).json({ message: "Gagal melakukan logout!" });
    }
  }
})();
