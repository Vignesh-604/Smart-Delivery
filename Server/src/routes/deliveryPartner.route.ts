import express from "express";
import {
    registerPartner,
    getAllPartners,
    getPartnerById,
    updatePartner,
    deletePartner,
    findEligiblePartners,
} from "../controllers/deliveryPartner";

const router = express.Router();

router.post("/", registerPartner)
router.get("/", getAllPartners)
router.get("/:partnerId", getPartnerById)
router.put("/:partnerId", updatePartner)
router.delete("/:partnerId", deletePartner)
router.get("/eligible", findEligiblePartners)

export default router
