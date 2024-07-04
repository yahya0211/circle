import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { addThread, uploadMultipleImage } from "../utils/ThreadUtil";
import cloudinary from "../config";
import * as fs from "fs";
import redisClient, { DEFAULT_EXPIRATION } from "../cache/redis";
import { log } from "console";

const prisma = new PrismaClient();

function isValidUUID(uuid: string): boolean {
  const UUIDregex = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return UUIDregex.test(uuid);
}

let isRedisConnected = false;
async function redisConnectedDone() {
  if (!isRedisConnected) {
    try {
      await redisClient.connect();
      isRedisConnected = true;
    } catch (error) {
      console.log("Error connecting to redis", error);
    }
  }
}

export default new (class ThreadService {
  private readonly ThreadRepository = prisma.thread;
  private readonly UserRepository = prisma.users;
  private readonly LikeRepository = prisma.like;

  async findAllRedis(req: Request, res: Response): Promise<Response> {
    try {
      redisConnectedDone();
      const page = parseInt(req.params.page) || 1;

      const pageSize = 10;
      const skip = (page - 1) * pageSize;

      const cacheKey = `threads_page_${page}`;
      if (!cacheKey) return res.status(404).json({ message: "Key not found" });

      const cacheData = await redisClient.get(cacheKey);

      if (cacheData) {
        const threads = JSON.parse(cacheData);
        const findThreads = await this.ThreadRepository.findMany({
          skip,
          take: pageSize,
          include: {
            user: true,
            like: true,
            replies: true,
          },
          orderBy: {
            created_at: "desc",
          },
        });
        const totalThread = await this.ThreadRepository.count();
        const totalPages = Math.ceil(totalThread / pageSize);

        // Pengecekan data ketersediaan data baru di database
        if (
          threads.data.length === findThreads.length &&
          threads.pagination.totalThread == totalThread &&
          threads.pagination.totalPages == totalPages &&
          findThreads.every((findThreads, index) => findThreads.content === threads.data[index].content && findThreads.image === threads.data[index].image)
        ) {
          // jika tidak ada perbahan maka tampilkan data di redis
          return res.status(200).json({
            code: 200,
            status: "Success",
            message: "Success find all cache threads",
            data: threads,
          });
        } else {
          //jika ada perubahan, maka data yang ada di redis akan dihapus dan mengambil data baru
          await redisClient.del(cacheKey);
        }
      }

      //Mengambil data ulang dari database
      const threads1 = await this.ThreadRepository.findMany({
        skip,
        take: pageSize,
        include: {
          user: true,
          like: true,
          replies: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const totalThread = await this.ThreadRepository.count();
      const totalPages = Math.ceil(totalThread / pageSize);

      if (page > totalPages) return res.status(404).json({ message: "Page not found" });

      const threads2 = {
        data: threads1,
        pagination: {
          totalPages,
          totalThread,
          currentPage: page,
          pageSize,
        },
      };

      redisClient.setEx(
        cacheKey,
        DEFAULT_EXPIRATION,
        JSON.stringify({
          message: "find all cache thread success",
          data: threads2.data,
          pagination: threads2.pagination,
        })
      );

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Success find all threads",
        data: threads2,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.params.page) || 1;

      const pageSize = 10;


      const skip = (page - 1) * pageSize;

      const threads = await this.ThreadRepository.findMany({
        skip,
        take: pageSize,
        include: {
          user: true,
          like: true,
          replies: true,
        },
        orderBy: {
          created_at: "desc",

        },
      });

      const totalThread = await this.ThreadRepository.count();

      const totalPages = Math.ceil(totalThread / pageSize);

      // if (page > totalPages) return res.status(404).json({ message: "Page not found" });

      const threadss = {
        data: threads,
        pagination: {
          totalThread,
          totalPages,
          currentPage: page,
          pageSize,
        },
      };

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Success find all threads",
        data: threadss,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const threadId = req.params.threadId;

      if (!isValidUUID(threadId)) {
        return res.status(400).json({ message: "invalid UUID" });
      }

      const thread = await this.ThreadRepository.findUnique({
        where: { id: threadId },
        include: {
          like: true,
          user: true,
          replies: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!thread) return res.status(404).json({ message: "Thread not found" });

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Success find id threads",
        data: thread,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async addThread(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;
      const { error } = addThread.validate(body);
      if (error) return res.status(400).json({ message: error.message });

      const userId = res.locals.loginSession.User.id;

      const userSelect = await this.UserRepository.findUnique({
        where: { id: userId },
      });

      if (!userSelect) return res.status(404).json({ message: "User not found" });

      let image = req.file;
      let image_url = "";

      if (!image) {
        image_url = "";
      } else {
        const cloudinaryUpload = await cloudinary.uploader.upload(image.path, {
          folder: "Circle53",
        });
        image_url = cloudinaryUpload.secure_url;
        fs.unlinkSync(image.path);
      }

      const thread = await this.ThreadRepository.create({
        data: {
          content: body.content,
          image: image_url,
          created_at: new Date(),
          user: {
            connect: { id: userId },
          },
        },
      });

      return res.status(201).json({
        code: 201,
        status: "Success",
        message: "Success find id add threads",
        data: thread,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async updateThread(req: Request, res: Response): Promise<Response> {
    try {
      const threadId = req.params.threadId;

      if (!isValidUUID(threadId)) {
        return res.status(400).json({ message: "invalid UUID" });
      }

      const userId = res.locals.loginSession.User.id;

      const userSelect = await this.UserRepository.findUnique({
        where: { id: userId },
      });

      if (!userSelect) return res.status(404).json({ message: "User not found" });

      const body = req.body;
      const { error } = addThread.validate(body);
      if (error) return res.status(400).json({ message: error.message });

      let image_url: string[] = [];

      if (Array.isArray(req.files)) {
        for (const file of req.files as Express.Multer.File[]) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "Circle53",
          });
          image_url.push(result.secure_url);
        }
      } else {
        const file = req.file as Express.Multer.File;
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "Circle53",
        });
        image_url.push(result.secure_url);
      }

      const threadUpdate = await this.ThreadRepository.update({
        where: { id: threadId },
        data: {
          content: body.content,
          images: {
            set: image_url,
          },
          created_at: new Date(),
          user: { connect: { id: userId } },
        },
      });

      if (Array.isArray(req.files)) {
        for (const file of req.files as Express.Multer.File[]) {
          fs.unlinkSync(file.path);
        }
      } else {
        fs.unlinkSync((req.file as Express.Multer.File).path);
      }

      return res.status(201).json({
        code: 201,
        status: "Success",
        message: "Success update threads",
        data: threadUpdate,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async deleteThread(req: Request, res: Response): Promise<Response> {
    try {
      const threadId = req.params.threadId;

      if (!isValidUUID(threadId)) {
        return res.status(400).json({ message: "invalid UUID" });
      }

      const userId = res.locals.loginSession.User.id;

      const userSelect = await this.UserRepository.findUnique({
        where: { id: userId },
      });

      if (!userSelect) return res.status(404).json({ message: "User not found" });

      const oldThreadData = await this.ThreadRepository.findUnique({
        where: { id: userId },
        select: {
          image: true,
        },
      });

      if (oldThreadData && oldThreadData) {
        const publicId = oldThreadData.image?.split("/").pop()?.split("_")[0];
        await cloudinary.uploader.destroy(publicId as string);
      }

      const deleteThread = await this.ThreadRepository.delete({
        where: { id: threadId },
      });

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Success delete threads",
        data: deleteThread,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }

  async uploadMultipleImage(req: Request, res: Response) {
    try {
      const userId = res.locals.loginSession.User.id;

      const userSelect = await this.UserRepository.findUnique({
        where: { id: userId },
      });

      if (!userSelect) return res.status(404).json({ message: "User not found" });

      const body = req.body;
      const { error } = uploadMultipleImage.validate(body);
      if (error) return res.status(400).json({ message: error.message });

      const images = req.files;

      const image_url: string[] = [];

      if (Array.isArray(req.files)) {
        for (const file of req.files as Express.Multer.File[]) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "Circle53",
          });
          image_url.push(result.url);
          fs.unlinkSync(file.path);
        }
      } else {
        const file = req.files as unknown as Express.Multer.File;
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "Circle53",
        });
        image_url.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
      const thread = await this.ThreadRepository.create({
        data: {
          content: body.content,
          image: "",
          images: image_url,
          created_at: new Date(),
          user: { connect: { id: userId } },
        },
      });

      return res.status(200).json({
        code: 201,
        status: "Success",
        message: "Add Threads Success",
        data: thread,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
})();
