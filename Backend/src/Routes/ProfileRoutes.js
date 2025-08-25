import express from 'express';
import {
  getUserProfile,
  updateDisplayPicture,
  updateUserProfile,
  deleteUserProfile,


} from '../Controllers/ProfileController.js';
import authMiddleware from '../Middleware/auth.middlewares.js';
import {upload} from "../Middleware/multer.js";
const router = express.Router();

router.get('/getUserProfile', authMiddleware , getUserProfile);
router.put('/updateUserProfile', authMiddleware , updateUserProfile);
router.put('/updateDisplayPicture', upload.single("image") , authMiddleware , updateDisplayPicture);
router.delete('/deleteUserProfile',authMiddleware, deleteUserProfile);

export default router;
