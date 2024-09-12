import mongoose from "mongoose";
import Message from "./messages.model.mjs";

const getMessage = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }
    try {
        const message = await Message.findById(id);
        return message;
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
};

export { getMessage };
