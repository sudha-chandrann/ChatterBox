import { Router } from "express";
import { RegisterUser ,LoginUser,getuserDetails,logout,updateuserdetails,Searchuser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/authmiddleware.js";
const router=Router()
router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);
router.route("/getuser").get(verifyJWT,getuserDetails);
router.route("/logout").get(verifyJWT,logout);
router.route("/update").patch(verifyJWT,updateuserdetails);
router.route("/search-user").post(verifyJWT,Searchuser);

  
export default router
