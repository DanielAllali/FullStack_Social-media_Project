import React, { useEffect, useState } from "react";
import "./postPreview.css";
import Header from "../header/Header";
import Post from "../post/Post";
import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const PostPreview = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const language = useSelector((state) => state.tiktak.language);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();

    useEffect(() => {
        if (postId) {
            callApi(`http://localhost:9999/posts/${postId}`);
        } else {
            toast.error(
                language === "HE" ? "לא סופק פוסט." : "No post provided."
            );
        }
    }, []);
    useEffect(() => {
        if (apiResponse && !errors) {
            setPost(apiResponse);
        }
        if (errors) {
            toast.error(language === "HE" ? "תקלה בשרת." : "Server error.");
        }
    }, [apiResponse, errors]);
    useEffect(() => {
        if (postId && post && postId !== post._id) {
            window.location.reload();
        }
    }, [postId]);
    return (
        <div id="postPreview">
            <Header />
            {post && (
                <div className="post">
                    <Post post={post} />
                </div>
            )}
        </div>
    );
};

export default PostPreview;
