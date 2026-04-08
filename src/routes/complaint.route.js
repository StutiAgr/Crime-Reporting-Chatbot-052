import express from "express";
import {
    registerComplaint,
    allComplaint,
    updateComplaint,
    complaintDetails
} from "../controllers/compaint.controller.js";
const router = express.Router();

router
.get('/', allComplaint)
.post('/', registerComplaint)
.patch('/:id', updateComplaint)
.get('/:id', complaintDetails);

export default router;