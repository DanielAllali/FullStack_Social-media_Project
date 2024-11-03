import React, { useEffect, useState } from "react";
import "./editPost.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setDisplayRefreshBtn } from "../TiktakSlice";
import useApi, { METHOD } from "../../hooks/useApi.jsx";
import { verifyCreatePost } from "../../guard.js";

const EditPost = ({ post, setDisplayEditPost }) => {
    const language = useSelector((state) => state.tiktak.language);

    const dispatch = useDispatch();
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [fields, setFields] = useState({
        title: post.title,
        subtitle: post.subtitle,
        content: post.content,
        imageURL: post.image.src,
    });
    const [fieldErrors, setFieldErrors] = useState({
        title: false,
        subtitle: false,
        content: false,
        imageURL: false,
    });
    const [fieldsValid, setFieldsValid] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedField = { ...fields, [name]: value };
        setFields(updatedField);

        const updatedFieldErrors = {
            title: verifyCreatePost.title(updatedField.title),
            subtitle: verifyCreatePost.subtitle(updatedField.subtitle),
            content: verifyCreatePost.content(updatedField.content),
            imageURL: verifyCreatePost.imageSrc(updatedField.imageURL),
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
                alt: post.image.alt,
            },
        };
        callApi(
            `http://localhost:9999/posts/${post._id}`,
            METHOD.PUT,
            newPost,
            {
                authorization: localStorage.getItem("jwt-token"),
            }
        );
    };
    useEffect(() => {
        if (apiResponse && !errors) {
            toast.success(
                language === "HE"
                    ? "פוסט נערך בהצלחה!"
                    : "Post edited successfuly!"
            );
            dispatch(setDisplayRefreshBtn());
            setDisplayEditPost(false);
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
        <div id="editPostWrapper">
            <div className="editPostContent">
                <div>
                    <h1>{language === "HE" ? "ערוך פוסט" : "Edit post"}</h1>
                    <button
                        onClick={() => {
                            setDisplayEditPost(false);
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
                                        value={fields.title}
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
                                        value={fields.subtitle}
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
                                        value={fields.content}
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
                                        value={fields.imageURL}
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

export default EditPost;
