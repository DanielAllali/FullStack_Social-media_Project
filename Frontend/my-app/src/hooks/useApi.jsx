import React, { useState } from "react";
import axios from "axios";

const useApi = () => {
    const [errors, setErrors] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [url, setUrl] = useState(null);

    const callApi = async (url, method = METHOD.POST, payload) => {
        setUrl(url);
        try {
            setIsLoading(true);
            let response;

            switch (method) {
                case METHOD.POST:
                    response = await axios
                        .post(url, payload)
                        .then(function (res) {
                            setApiResponse(res.data ? res.data : res);
                            return;
                        })
                        .catch(function (err) {
                            setErrors(err);
                        });
                    break;
            }
            setApiResponse(response.data);
        } catch (err) {
            setErrors(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return [errors, isLoading, apiResponse, callApi, url];
};

export const METHOD = {
    POST: "POST",
};

export default useApi;
