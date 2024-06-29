import {API_BASE_URL} from "./apiConfig.js";

async function httpSend(api, method, request) {
    let defaultObj = {};

    let options = {
        "method" : method,
        "headers" : {"Content-Type" : "application/json"},
        "url": API_BASE_URL + api
    };
    if (request){
        options.body = JSON.stringify(request);
    }

    const response = await fetch(options.url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok - ' + response.status);
    }
    const resData = await response.json();

    if (resData.error == null) {
        const colorLogData = resData.data[0];
        return colorLogData;
    }
    return defaultObj;
}

export {httpSend};