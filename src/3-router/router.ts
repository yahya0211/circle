import * as express from "express";
import * as path from "path";
import AuthController from "../2-controller/AuthController";
import UserController from "../2-controller/UserController";
import AuthMidleware from "../middleware/AuthMidleware";
import upload from "../middleware/UploadMiddleware";
import ThreadController from "../2-controller/ThreadController";
import FollowController from "../2-controller/FollowController";
import LikeController from "../2-controller/LikeController";
import ReplyController from "../2-controller/ReplyController";

const router = express.Router();

//Auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthMidleware.Auth, AuthController.logout);
router.get("/check", AuthMidleware.Auth, AuthController.check);

//Follow
router.post("/follow/:followingId", AuthMidleware.Auth, FollowController.follow);

//Like
router.post("/thread/:threadId/like", AuthMidleware.Auth, LikeController.like);

//Reply
router.post("/addReply/:threadId/reply", AuthMidleware.Auth, upload.single("image"), ReplyController.addReply);
router.put("/updateReply/:threadId/reply/:replyId", AuthMidleware.Auth, upload.single("image"), ReplyController.updateReply);
router.delete("/deleteReply/:replyId", AuthMidleware.Auth, upload.single("image"), ReplyController.deleteReply);

// User
router.get("/findUser", AuthMidleware.Auth, UserController.findAll);
router.get("/findByUserId/:userId", AuthMidleware.Auth, UserController.findById);
router.get("/findByUserName/:username", AuthMidleware.Auth, UserController.findByName);
router.get("/getSuggested", AuthMidleware.Auth, UserController.getSugestedUser);
router.put("/userProfileNoImage/:userId", AuthMidleware.Auth, UserController.updateWithoutImage);
router.put("/userProfileImage/:userId", AuthMidleware.Auth, upload.single("image"), UserController.uploadProfilePicture);
router.put("/editProfile/:userId", AuthMidleware.Auth, upload.single("image"), UserController.editProfile);
router.delete("/deleteUser/:userId", AuthMidleware.Auth, UserController.delete);

//Thread
router.get("/findAllThread/:page", AuthMidleware.Auth, ThreadController.findAll);
router.get("/findThreadById/:threadId", AuthMidleware.Auth, ThreadController.findById);
router.post("/uploadMultiple", AuthMidleware.Auth, upload.any(), ThreadController.uploadMultipleImage);
router.post("/addThread", AuthMidleware.Auth, upload.any(), ThreadController.addThread);
router.put("/updateThread/:threadId", AuthMidleware.Auth, upload.any(), ThreadController.updateThread);
router.delete("/deleteThread/:threadId", AuthMidleware.Auth, upload.single("image"), ThreadController.deleteThread);

// Thread Queue
router.post("/addThreadQueue/:userId", AuthMidleware.Auth, upload.single("image"), ThreadController.addThreadQueue);

//Thread Page Redis
router.get("/threadredis/:page", AuthMidleware.Auth, ThreadController.findAllRedis);

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default router;
