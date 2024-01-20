import { Router } from "express";
import UsersAuthController from "./controller";
import IUserAuthValidation from "./middleware";

const router: Router = Router();

const { execute } = new UsersAuthController();
const { protect } = new IUserAuthValidation();

router.post("/employees", execute);    //routes
router.get("/allemployees", execute);
router.get("/employees/:employeeId", execute);
router.put("/employees/:employeeId", protect, execute);
router.delete("/employees/:employeeId", protect, execute);

export default router;
