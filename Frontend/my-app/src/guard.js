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
        const validImageTypes = [
            "image/jpeg", // JPEG
            "image/png", // PNG
            "image/gif", // GIF
            "image/bmp", // BMP
            "image/tiff", // TIFF
            "image/svg+xml", // SVG
            "image/webp", // WEBP
            "image/jfif", // JFIF
        ];

        const maxSizeInBytes = 5 * 1024 * 1024; // Maximum size in bytes (e.g., 5 MB)

        const errorMessages = {
            invalidFileType: {
                en: "Invalid file type. Please upload an image (JPEG, PNG, GIF, BMP, TIFF, SVG, WEBP, JFIF).",
                he: "סוג קובץ לא תקין. אנא העלה תמונה (JPEG, PNG, GIF, BMP, TIFF, SVG, WEBP, JFIF).",
            },
            fileSizeExceeded: {
                en: "File size exceeds the limit of 5 MB.",
                he: "גודל הקובץ חורג מהמגבלה של 5 MB.",
            },
            noFileSelected: {
                en: "No file selected.",
                he: "לא נבחר קובץ.",
            },
        };

        if (v) {
            if (!validImageTypes.includes(v.type)) {
                return errorMessages.invalidFileType;
            }

            if (v.size > maxSizeInBytes) {
                return errorMessages.fileSizeExceeded;
            }

            return false;
        } else {
            return errorMessages.noFileSelected;
        }
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

const verifyCreatePost = {
    title: (v) => {
        if (!v || v.trim() === "") {
            return {
                he: "כותרת נדרשת.",
                en: "Title is required.",
            };
        }
        if (v.length > 50) {
            return {
                he: "הכותרת חייבת להיות עד 50 תווים.",
                en: "Title must be up to 50 characters.",
            };
        }
        return false;
    },
    subtitle: (v) => {
        if (v.length > 50) {
            return {
                he: "הכותרת המשנית חייבת להיות עד 50 תווים.",
                en: "Subtitle must be up to 50 characters.",
            };
        }
        return false;
    },
    content: (v) => {
        if (!v || v.trim() === "") {
            return {
                he: "תוכן נדרש.",
                en: "Content is required.",
            };
        }
        if (v.length > 300) {
            return {
                he: "התוכן חורג מאורך מקסימלי של 300 תווים.",
                en: "Content exceeds the maximum length of 300 characters.",
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
    videoSrc: (v) => {
        if (v === "") {
            return false;
        }
        if (!urlRegex.test(v)) {
            return {
                he: "כתובת URL של הווידאו לא חוקית.",
                en: "Invalid video URL.",
            };
        }
        if (v.length > 300) {
            return {
                he: "כתובת הווידאו חורגת מאורך מקסימלי של 300 תווים.",
                en: "Video URL exceeds the maximum length of 300 characters.",
            };
        }
        return false;
    },
};
const verifySandbox = (sandbox) => {
    const { content } = sandbox;

    if (!content) {
        return {
            valid: false,
            message: {
                en: 'Object must contain "content" and "image".',
                he: 'האובייקט חייב להכיל "תוכן" ו"תמונה".',
            },
        };
    }

    if (!content.he || !content.en) {
        return {
            valid: false,
            message: {
                en: 'Content must be an object with two keys "he" and "en".',
                he: 'התוכן חייב להיות אובייקט עם שני מפתחות "he" ו-"en".',
            },
        };
    }

    for (const key in content) {
        if (content[key].length < 1 || content[key].length >= 40) {
            return {
                valid: false,
                message: {
                    en: 'Each value in "content" must be between 1 and 40 characters.',
                    he: "כל ערך בתוכן חייב להיות בין 1 ל-40 תווים.",
                },
            };
        }
    }

    return { valid: true };
};
const verifyEditUser = {
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
    username: (v) => {
        if (v !== "" && (v.length < 2 || v.length > 15)) {
            return {
                he: "שם המשתמש חייב להיות בין 2 ל-15 תווים או ריק.",
                en: "Username must be between 2 and 15 characters or empty.",
            };
        }
        return false;
    },
    bio: (v) => {
        if (v !== "" && v.length > 30) {
            return {
                he: "ביוגרפיה צריכה להיות בין 0-30 תווים.",
                en: "Bio must be between 0-30 characters.",
            };
        }
    },
    imageSrc: (v) => {
        const validImageTypes = [
            "image/jpeg", // JPEG
            "image/png", // PNG
            "image/gif", // GIF
            "image/bmp", // BMP
            "image/tiff", // TIFF
            "image/svg+xml", // SVG
            "image/webp", // WEBP
            "image/jfif", // JFIF
        ];

        const maxSizeInBytes = 5 * 1024 * 1024; // Maximum size in bytes (e.g., 5 MB)

        const errorMessages = {
            invalidFileType: {
                en: "Invalid file type. Please upload an image (JPEG, PNG, GIF, BMP, TIFF, SVG, WEBP, JFIF).",
                he: "סוג קובץ לא תקין. אנא העלה תמונה (JPEG, PNG, GIF, BMP, TIFF, SVG, WEBP, JFIF).",
            },
            fileSizeExceeded: {
                en: "File size exceeds the limit of 5 MB.",
                he: "גודל הקובץ חורג מהמגבלה של 5 MB.",
            },
            noFileSelected: {
                en: "No file selected.",
                he: "לא נבחר קובץ.",
            },
        };

        if (v) {
            if (!validImageTypes.includes(v.type)) {
                return errorMessages.invalidFileType;
            }

            if (v.size > maxSizeInBytes) {
                return errorMessages.fileSizeExceeded;
            }

            return false;
        } else {
            return errorMessages.noFileSelected;
        }
    },
};

export {
    verifyLogin,
    verifyRegister,
    verifyMessageContent,
    verifyCreatePost,
    verifySandbox,
    verifyEditUser,
};
