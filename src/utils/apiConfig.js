let backendHost;
const port = 5000;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
    backendHost = `http://ec2-3-36-121-168.ap-northeast-2.compute.amazonaws.com:${port}`
}

export const API_BASE_URL = `${backendHost}`;