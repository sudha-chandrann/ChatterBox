import { Router } from "express";
import { getallMessages } from "../controllers/message.controller.js";
import { verifyJWT } from "../middleware/authmiddleware.js";
const router=Router()

router.route("/get-chats").post(verifyJWT,getallMessages);

  
export default router
