import User from "./handlers/users/users.model.mjs";

const generateUsername = async () => {
    const users = await User.find();
    const letters = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
    ];

    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let username = "";
    let generated = false;

    while (!generated) {
        username = "User";
        for (let i = 1; i <= 11; i++) {
            username +=
                Math.random() < 0.5
                    ? letters[Math.floor(Math.random() * letters.length)]
                    : numbers[Math.floor(Math.random() * numbers.length)];
        }
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            generated = true;
        } else {
            username = "";
        }
    }

    return username;
};

export { generateUsername };
