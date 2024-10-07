import React, { useState } from "react";
import axios from "axios";

const useApi = () => {
    const [errors, setErrors] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [url, setUrl] = useState(null);

    const callApi = async (url, method = METHOD.GET, payload, headers = {}) => {
        setUrl(url);
        try {
            setIsLoading(true);
            let response;

            switch (method) {
                case METHOD.GET:
                    response = await axios.get(url, headers);
                    setApiResponse(response.data);
                    break;
                case METHOD.POST:
                    response = await axios.post(url, payload);
                    setApiResponse(response.data);
                    break;
            }
            setApiResponse(response.data);
        } catch (err) {
            setErrors(err);
        } finally {
            setIsLoading(false);
        }
    };

    return [errors, setErrors, isLoading, apiResponse, callApi, url];
};

export const METHOD = {
    POST: "POST",
    GET: "GET",
};

export default useApi;
