const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*_-]{8,20}$/;
const urlRegex =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;

const verifyLogin = {
    email: (v) => {
        if (!v) {
            return {
                he: "דואר אלקטרוני נדרש.",
                en: "Email is required.",
            };
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(v)) {
            return {
                he: "פורמט דואר אלקטרוני לא חוקי.",
                en: "Invalid email format.",
            };
        }

        return false;
    },
    password: (v) => {
        if (!v) {
            return {
                he: "סיסמה נדרשת.",
                en: "Password is required.",
            };
        }

        if (!passwordRegex.test(v)) {
            return {
                he: "הסיסמה חייבת להיות באורך 8-20 תווים, לכלול לפחות אות גדולה אחת ומספר אחד.",
                en: "Password must be 8-20 characters long, include at least one uppercase letter and one number.",
            };
        }

        return false;
    },
};

const verifyRegister = {
    username: (v) => {
        if (v !== "" && (v.length < 2 || v.length > 15)) {
            return {
                he: "שם המשתמש חייב להיות בין 2 ל-15 תווים או ריק.",
                en: "Username must be between 2 and 15 characters or empty.",
            };
        }
        return false;
    },
    firstName: (v) => {
        if (!v) {
            return {
                he: "שם פרטי נדרש.",
                en: "First name is required.",
            };
        }
        return false;
    },
    lastName: (v) => {
        if (!v) {
            return {
                he: "שם משפחה נדרש.",
                en: "Last name is required.",
            };
        }
        return false;
    },
    email: (v) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;
        if (!v) {
            return {
                he: "דואר אלקטרוני נדרש.",
                en: "Email is required.",
            };
        }
        if (!emailPattern.test(v)) {
            return {
                he: "פורמט דואר אלקטרוני לא חוקי.",
                en: "Invalid email format.",
            };
        }
        return false;
    },
    phone: (v) => {
        return false; // Optional field, so no validation needed.
    },
    password: (v) => {
        if (!v) {
            return {
                he: "סיסמה נדרשת.",
                en: "Password is required.",
            };
        }
        if (!passwordRegex.test(v)) {
            return {
                he: "הסיסמה חייבת להיות באורך 8-20 תווים, לכלול לפחות אות גדולה אחת ומספר אחד.",
                en: "Password must be 8-20 characters long, include at least one uppercase letter and one number.",
            };
        }
        return false;
    },
    imageSrc: (v) => {
        if (!v) {
            return false;
        }
        if (!urlRegex.test(v)) {
            return {
                he: "כתובת URL של התמונה לא חוקית.",
                en: "Invalid image URL.",
            };
        }
        return false;
    },
    imageAlt: (v) => {
        if (v.length > 30) {
            return {
                he: "הטקסט האלטרנטיבי של התמונה חייב להיות פחות מ-30 תווים.",
                en: "Image alt text must be less than 30 characters.",
            };
        }
        return false;
    },
};
const verifyMessageContent = (v) => {
    if (typeof v !== "string") {
        return {
            en: "Content should be a string.",
            he: "התוכן חייב להיות מחרוזת.",
        };
    }

    if (v.trim() === "") {
        return {
            en: "Content cannot be empty.",
            he: "התוכן לא יכול להיות ריק.",
        };
    }

    if (v.length > 300) {
        return {
            en: "Content exceeds the maximum length of 300 characters.",
            he: "התוכן חורג מאורך מקסימלי של 300 תווים.",
        };
    }

    return null;
};
export { verifyLogin, verifyRegister, verifyMessageContent };
