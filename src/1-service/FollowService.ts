import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

function isValidUUID(uuid: string): boolean {
  const UUIDregex = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return UUIDregex.test(uuid);
}

export default new (class FollowService {
  private readonly UserRepository = prisma.users;
  private readonly UserFollowingRepository = prisma.userfollowing;

  async follow(req: Request, res: Response): Promise<Response> {
    try {
      const followingId = req.params.followingId;

      if (!isValidUUID(followingId)) {
        return res.status(400).json({ message: "invalid UUID" });
      }

      const userId = res.locals.loginSession.User.id;

      if (followingId == userId) return res.status(400).json({ message: " You can't follow yourself" });

      const followingUser = await this.UserRepository.findUnique({
        where: {
          id: followingId,
        },
      });

      if (!followingUser) return res.status(404).json({ message: "User not found" });

      // Mencari data dari database

      const followerUser = await this.UserRepository.findUnique({
        where: {
          id: userId,
        },
      });

      if (!followerUser) return res.status(400).json({ message: "User not found" });

      //mencari pengguna apakah sudah follow user
      const exitingFollow = await this.UserFollowingRepository.findFirst({
        where: {
          followerId: followingId,
          followingId: userId,
        },
      });

      if (exitingFollow) {
        await this.UserFollowingRepository.delete({
          where: {
            // mengambil data user following berdasarkan id
            // dan akan mendelete jika ada data yang sama
            id: exitingFollow.id,
          },
        });
        return res.status(200).json({ message: "You unfollow this user" });
      }

      //menangani ketika belum follow
      const followUser = await this.UserFollowingRepository.create({
        data: {
          followerId: followingId,
          followingId: userId,
          isFollow: true,
        },
      });

      return res.status(200).json({
        code: 200,
        message: "Follow user success",
        data: followUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
  }
})();
