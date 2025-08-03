import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";
import { validateRequest, validateRequestParams } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserRole } from "./user.interface";
import { updateUserSchemaZod, userIdParamSchema } from "./user.validate.zod";


const router = Router();


router.get(  "/all-user",  checkAuth(UserRole.ADMIN),  UserController.getAllUsers);
router.patch(  "/block/:id", validateRequestParams(userIdParamSchema), checkAuth(UserRole.ADMIN),  UserController.blockUnblockUser);

router.patch( '/unblock/:id', checkAuth(UserRole.ADMIN), UserController.blockUnblockUser
);

// router.patch('/unblock/:id', checkAuth(UserRole.ADMIN), UserController.blockUnblockUser);
router.patch(  "/:id", validateRequest(updateUserSchemaZod),  checkAuth(...Object.values(UserRole)), UserController.updateUser);

export const UserRoutes = router;
