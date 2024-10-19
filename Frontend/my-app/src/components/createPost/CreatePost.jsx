import React, { useEffect, useState } from "react";
import "./createPost.css";
import { useSelector } from "react-redux";
import { verifyCreatePost } from "../../guard";
import useApi, { METHOD } from "../../hooks/useApi";
import toast from "react-hot-toast";

const CreatePost = ({ setCreatePostPopup, user, setDisplayRefreshBtn }) => {
    const language = useSelector((state) => state.tiktak.language);

    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [fields, setFields] = useState({
        title: "",
        subtitle: "",
        content: "",
        imageURL: "",
        videoURL: "",
    });
    const [fieldErrors, setFieldErrors] = useState({
        title: false,
        subtitle: false,
        content: false,
        imageURL: false,
        videoURL: false,
    });
    const [fieldsValid, setFieldsValid] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedField = { ...fields, [name]: value };
        setFields(updatedField);

        const updatedFieldErrors = {
            title: verifyCreatePost.title(updatedField.title),
            subtitle: verifyCreatePost.subtitle(updatedField.subtitle),
            content: verifyCreatePost.content(updatedField.content),
            imageURL: verifyCreatePost.imageSrc(updatedField.imageURL),
            videoURL: verifyCreatePost.videoSrc(updatedField.videoURL),
        };
        setFieldErrors(updatedFieldErrors);

        const isValid = !Object.values(updatedFieldErrors).some(Boolean);
        setFieldsValid(isValid);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fieldsValid) {
            return;
        }
        const newPost = {
            title: fields.title,
            subtitle: fields.subtitle,
            content: fields.content,
            image: {
                src: fields.imageURL,
                alt: `${user.username ? user.username : "user"}'s post image`,
            },
            video: {
                src: fields.videoURL,
                alt: `${user.username ? user.username : "user"}'s post video`,
            },
        };
        callApi("http://localhost:9999/posts", METHOD.POST, newPost, {
            authorization: localStorage.getItem("jwt-token"),
        });
    };
    useEffect(() => {
        if (apiResponse && !errors) {
            toast.success(
                language === "HE"
                    ? "פוסט נוצר בהצלחה!"
                    : "Post created successfuly!"
            );
            setDisplayRefreshBtn(true);
            setCreatePostPopup(false);
        } else if (errors) {
            toast.error(
                errors.response
                    ? errors.response.data
                        ? errors.response.data
                        : language === "HE"
                        ? "תקלה בשרת..."
                        : "Server error..."
                    : language === "HE"
                    ? "תקלה בשרת..."
                    : "Server error..."
            );
        }
    }, [apiResponse, errors]);
    return (
        <div id="createPostWrapper">
            <div className="createPostContent">
                <div>
                    <h1>{language === "HE" ? "צור פוסט" : "Create post"}</h1>
                    <button
                        onClick={() => {
                            setCreatePostPopup(false);
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
                                        name="title"
                                        type="text"
                                        id="title"
                                    />
                                    <label htmlFor="title">
                                        {language === "HE"
                                            ? "כותרת*"
                                            : "Title*"}
                                    </label>
                                    <h2
                                        className={
                                            fieldErrors.title ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.title &&
                                            (language === "HE"
                                                ? fieldErrors.title.he
                                                : fieldErrors.title.en)}
                                    </h2>
                                </td>
                                <td>
                                    <input
                                        onChange={handleChange}
                                        name="subtitle"
                                        type="text"
                                        id="subtitle"
                                    />
                                    <label htmlFor="subtitle">
                                        {language === "HE"
                                            ? "כותרת משנית"
                                            : "Subtitle"}
                                    </label>
                                    <h2
                                        className={
                                            fieldErrors.subtitle ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.subtitle &&
                                            (language === "HE"
                                                ? fieldErrors.subtitle.he
                                                : fieldErrors.subtitle.en)}
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <textarea
                                        onChange={handleChange}
                                        name="content"
                                        id="content"
                                    ></textarea>
                                    <label htmlFor="content">
                                        {language === "HE"
                                            ? "תוכן*"
                                            : "Content*"}
                                    </label>
                                    <h2
                                        className={
                                            fieldErrors.content ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.content &&
                                            (language === "HE"
                                                ? fieldErrors.content.he
                                                : fieldErrors.content.en)}
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        onChange={handleChange}
                                        name="imageURL"
                                        type="text"
                                        id="imageURL"
                                    />
                                    <label htmlFor="imageURL">
                                        {language === "HE"
                                            ? "קישור לתמונה"
                                            : "Image URL"}
                                    </label>
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
                                <td>
                                    <input
                                        onChange={handleChange}
                                        name="videoURL"
                                        type="text"
                                        id="videoURL"
                                    />
                                    <label htmlFor="videoURL">
                                        {language === "HE"
                                            ? "קישור לסירטון"
                                            : "Video URL"}
                                    </label>
                                    <h2
                                        className={
                                            fieldErrors.videoURL ? "show" : ""
                                        }
                                    >
                                        {fieldErrors.videoURL &&
                                            (language === "HE"
                                                ? fieldErrors.videoURL.he
                                                : fieldErrors.videoURL.en)}
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

export default CreatePost;
