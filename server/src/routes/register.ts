import { Router, Request, IRouter, Response } from "express";
import Register from "../controllers/register.js";
const router: IRouter = Router();
const signup = Register.signup.bind(Register);
/*router.use(function (req: Request, res: Response) {
  if (req.body.csrfToken !== req.csrfToken())
    return res.status(300).json({
      message: "Bad Request",
    });
});*/
router.post("/signup", Register.signup);
router.post("/login", Register.login);
router.post("/email", Register.emailExists);
router.post("/username", Register.userExists);
router.post("/token", Register.token);
export default router;
