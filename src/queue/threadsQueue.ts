import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import cloudinary from "../config";
import * as fs from "fs";
import { addThreadQueue } from "../utils/ThreadUtil";
import amqp from "amqplib";

const prisma = new PrismaClient();

export default new (class ThreadsQueue {
  private readonly UserRepository = prisma.users;
  private readonly ThreadRepository = prisma.thread;

  async addThreadQueue(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;
      const { error } = addThreadQueue.validate(body);
      if (error) return res.status(400).json({ message: error.message });

      const userId = res.locals.loginSession.User.id;

      const userSelect = await this.UserRepository.findUnique({
        where: { id: userId },
      });
      if (!userSelect) return res.status(404).json({ message: "User not found" });

      let image = req.file;
      let image_url = "";

      if (!image) {
        console.log("No file uploaded.");
        image_url = "";
      } else {
        const cloudinaryUpload = await cloudinary.uploader.upload(image.path, {
          folder: "Circle53",
        });
        image_url = cloudinaryUpload.secure_url;
        fs.unlinkSync(image.path);
      }

      const payload = {
        content: body.content,
        image: image_url,
        user: res.locals.loginSession.User.id,
      };

      const connection = await amqp.connect("amqp://localhost");
      const channel = await connection.createChannel();

      await channel.assertQueue("thread_circle53_queue");
      channel.sendToQueue("thread_circle53_queue", Buffer.from(JSON.stringify(payload)));

      let rabbitData;

      const messageProssesed = new Promise<void>((resolve, reject) => {
        channel.consume("thread_circle53_queue", async (message) => {
          if (message) {
            try {
              const payload = JSON.parse(message.content.toString());
              const rabbit = await this.ThreadRepository.create({
                data: {
                  content: payload.content,
                  image: payload.image_url,
                  created_at: new Date(),
                  user: { connect: { id: userId } },
                },
              });
              console.log("Dapat pesan", message.content.toString());

              rabbitData = rabbit;
              channel.ack(message);
              resolve();
            } catch (error) {
              console.log("Error proses pesannya:", error);
              reject(error);
            }
          }
        });
      });

      await messageProssesed;
      await channel.close();
      await connection.close();

      return res.status(201).json({
        code: 201,
        status: "Success",
        message: "Add Threads from rabbit MQ Success",
        data: rabbitData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
})();
