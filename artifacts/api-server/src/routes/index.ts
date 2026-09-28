import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tutorRouter from "./tutor";

const router: IRouter = Router();

router.use(healthRouter);
router.use(tutorRouter);

export default router;
