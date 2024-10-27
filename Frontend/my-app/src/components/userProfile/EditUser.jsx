import React, { useEffect, useState } from "react";
import "./editUser.css";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import { verifyEditUser } from "../../guard";
import toast from "react-hot-toast";

const EditUser = ({ setIsEditUser, user }) => {
    const language = useSelector((state) => state.tiktak.language);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();

    const [fields, setFields] = useState({
        firstName: user.name.firstName,
        lastName: user.name.lastName,
        username: user.username,
        bio: user.bio || "",
        imageURL: user.image.src || "",
    });
    const [fieldErrors, setFieldErrors] = useState({
        firstName: null,
        lastName: null,
        username: null,
        bio: null,
        imageURL: null,
    });
    const [fieldsValid, setFieldsValid] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const updatedField = { ...fields, [name]: value };

        if (type === "file" && files[0]) {
            updatedField.imageURL = URL.createObjectURL(files[0]); // Preview the selected file
        } else {
            updatedField[name] = value;
        }
        setFields(updatedField);

        const updatedFieldErrors = {
            firstName: verifyEditUser.firstName(updatedField.firstName),
            lastName: verifyEditUser.lastName(updatedField.lastName),
            username: verifyEditUser.username(updatedField.username),
            bio: verifyEditUser.bio(updatedField.bio),
            imageURL: !(files ? files[0] : null)
                ? null
                : verifyEditUser.imageSrc(files ? files[0] : null),
        };
        setFieldErrors(updatedFieldErrors);

        const isValid = !Object.values(updatedFieldErrors).some(Boolean);
        setFieldsValid(isValid);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name[firstName]", fields.firstName);
        formData.append("name[lastName]", fields.lastName);
        formData.append("username", fields.username);
        formData.append("bio", fields.bio);

        const imageFile = document.querySelector('input[type="file"]').files[0];

        if (imageFile) {
            formData.append("image", imageFile);
        }

        await callApi(
            `http://localhost:9999/users/${user._id}`,
            METHOD.PUT,
            formData,
            {
                authorization: localStorage.getItem("jwt-token"),
                "Content-Type": "multipart/form-data",
            }
        );
    };
    useEffect(() => {
        if (apiResponse && !errors) {
            console.log(apiResponse);

            toast.success(
                language === "HE"
                    ? "משתמש התעדכן בהצלחה!"
                    : "User updated successfuly!"
            );
        }
        if (errors) {
            toast.error(errors?.response?.data);
        }
    }, [apiResponse, errors]);
    return (
        <div id="editUserWrapper">
            <div className="editUserContent">
                <div>
                    <h1>{language === "HE" ? "ערוך משתמש" : "Edit user"}</h1>
                    <button
                        onClick={() => {
                            setIsEditUser(false);
                        }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <hr />
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        onChange={handleChange}
                                        name="firstName"
                                        value={fields.firstName}
                                        type="text"
                                        id="firstName"
                                    />
                                    <label htmlFor="firstName">
                                        {language === "HE"
                                            ? "שם*"
                                            : "First name*"}
                                    </label>
                                    <h2
                                        className={
                                            fieldErrors.firstName ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.firstName &&
                                            (language === "HE"
                                                ? fieldErrors.firstName.he
                                                : fieldErrors.firstName.en)}
                                    </h2>
                                </td>
                                <td>
                                    <input
                                        onChange={handleChange}
                                        name="lastName"
                                        value={fields.lastName}
                                        type="text"
                                        id="lastName"
                                    />
                                    <label htmlFor="lastName">
                                        {language === "HE"
                                            ? "שם משפחה*"
                                            : "Last name*"}
                                    </label>
                                    <h2
                                        className={
                                            fieldErrors.lastName ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.lastName &&
                                            (language === "HE"
                                                ? fieldErrors.lastName.he
                                                : fieldErrors.lastName.en)}
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        onChange={handleChange}
                                        name="username"
                                        value={fields.username}
                                        type="text"
                                        id="username"
                                    />
                                    <label htmlFor="username">
                                        {language === "HE"
                                            ? "שם משתמש"
                                            : "Username"}
                                    </label>
                                    <h2
                                        className={
                                            fieldErrors.username ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.username &&
                                            (language === "HE"
                                                ? fieldErrors.username.he
                                                : fieldErrors.username.en)}
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <textarea
                                        onChange={handleChange}
                                        name="bio"
                                        value={fields.bio}
                                        id="bio"
                                    ></textarea>
                                    <label htmlFor="bio">
                                        {language === "HE" ? "ביוגרפיה" : "bio"}
                                    </label>
                                    <h2
                                        className={
                                            fieldErrors.bio ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.bio &&
                                            (language === "HE"
                                                ? fieldErrors.bio.he
                                                : fieldErrors.bio.en)}
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        onChange={handleChange}
                                        name="imageURL"
                                        type="file"
                                        id="imageURL"
                                    />
                                    <label htmlFor="imageURL">
                                        {language === "HE"
                                            ? "בחר תמונה חדשה"
                                            : "Choose new image"}
                                    </label>
                                    <img
                                        src={fields.imageURL}
                                        alt="Preview"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                        }}
                                    />
                                    <h2
                                        className={
                                            fieldErrors.imageURL ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.imageURL &&
                                            (language === "HE"
                                                ? fieldErrors.imageURL.he
                                                : fieldErrors.imageURL.en)}
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button
                                        disabled={!fieldsValid}
                                        className={
                                            fieldsValid ? "" : "disabled"
                                        }
                                        type="submit"
                                    >
                                        {!isLoading
                                            ? language === "HE"
                                                ? "צור"
                                                : "Create"
                                            : language === "HE"
                                            ? "רגע..."
                                            : "Wait..."}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
