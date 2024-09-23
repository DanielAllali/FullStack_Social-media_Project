const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*_-]{8,20}$/;

const verifyLogin = {
    email: (v) => {
        if (!v) {
            return "Email is required.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(v)) {
            return "Invalid email format.";
        }

        return false;
    },
    password: (v) => {
        if (!v) {
            return "Password is required.";
        }

        if (!passwordRegex.test(v)) {
            return "Password must be 8-20 characters long, include at least one uppercase letter and one number.";
        }

        return false;
    },
};

export { verifyLogin };
