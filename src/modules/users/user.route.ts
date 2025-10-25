import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";
import { validateRequest, validateRequestParams } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserRole } from "./user.interface";
import { emergencyContactValidation, updateUserSchemaZod, userIdParamSchema } from "./user.validate.zod";


const router = Router();

router.get(  "/me",  checkAuth(...Object.values(UserRole)),  UserController.getProfile);

//ai routhe ta add korlam 7:27pm
router.patch(  "/profile/:id",  checkAuth(...Object.values(UserRole)),  UserController.updateUser);



router.get(  "/all-user",  checkAuth(UserRole.ADMIN),  UserController.getAllUsers);
router.patch(  "/block/:id", validateRequestParams(userIdParamSchema), checkAuth(UserRole.ADMIN),  UserController.blockUnblockUser);

router.patch( '/unblock/:id', checkAuth(UserRole.ADMIN), UserController.blockUnblockUser
);

router.patch(  "/update/:id", validateRequest(updateUserSchemaZod),  checkAuth(...Object.values(UserRole)), UserController.updateUser);


//emergency contact
/**
 * @route   PATCH /api/user/emergency-contacts
 * @desc    Update user's emergency contacts
 * @access  Private
 */
router.patch(
  '/emergency-contacts',
  validateRequest(emergencyContactValidation.updateEmergencyContacts),checkAuth(...Object.values(UserRole)),
  UserController.updateEmergencyContacts
);

/**
 * @route   GET /api/user/emergency-contacts
 * @desc    Get user's emergency contacts
 * @access  Private
 */
router.get(
  '/emergency-contacts',
  validateRequest(emergencyContactValidation.getEmergencyContacts),checkAuth(...Object.values(UserRole)),
  UserController.getEmergencyContacts
);

/**
 * @route   POST /api/user/emergency-contacts
 * @desc    Add a single emergency contact
 * @access  Private
 */
router.post(
  '/emergency-contacts',
  validateRequest(emergencyContactValidation.addEmergencyContact),checkAuth(...Object.values(UserRole)),
  UserController.addEmergencyContact
);

/**
 * @route   DELETE /api/user/emergency-contacts/:contactIndex
 * @desc    Remove an emergency contact by index
 * @access  Private
 */
router.delete(
  '/emergency-contacts/:contactIndex',
  validateRequest(emergencyContactValidation.removeEmergencyContact),checkAuth(...Object.values(UserRole)),
  UserController.removeEmergencyContact
);



export const UserRoutes = router;