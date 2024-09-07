import User from "../handlers/users/users.model.mjs";
import initialData from "./initial-data.mjs";
import bcrypt from "bcrypt";

(async () => {
    const userAmount = await User.find().countDocuments();
    if (!userAmount) {
        for (const u of initialData.users) {
            const user = new User(u);
            user.password = await bcrypt.hash(user.password, 10);
            await user.save();
        }
    }
})();
