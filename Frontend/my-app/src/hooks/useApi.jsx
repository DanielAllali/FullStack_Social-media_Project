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
                    response = await axios.get(url, payload, { headers });
                    setApiResponse(response.data);
                    break;
                case METHOD.POST:
                    response = await axios.post(url, payload, { headers });
                    setApiResponse(response.data);
                    break;
                case METHOD.PATCH:
                    response = await axios.patch(url, payload, { headers });
                    setApiResponse(response.data);
                    break;
                case METHOD.PUT:
                    response = await axios.put(url, payload, { headers });
                    setApiResponse(response.data);
                    break;
                case METHOD.DELETE:
                    response = await axios.delete(url, { headers });
                    setApiResponse(response.data);
                    break;
            }
            setApiResponse(response.data);
        } catch (err) {
            console.log(err);

            setErrors(err);
            setApiResponse(null);
        } finally {
            setIsLoading(false);
        }
    };

    return [errors, setErrors, isLoading, apiResponse, callApi, url];
};

export const METHOD = {
    POST: "POST",
    GET: "GET",
    PATCH: "PATCH",
    PUT: "PUT",
    DELETE: "DELETE",
};

export default useApi;
