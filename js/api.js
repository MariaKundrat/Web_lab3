const BASE_URL = "http://localhost:1337/api";
const RESOURSE_URL = `${BASE_URL}/smartphone`;

const baseRequest = async ({ urlPath = "", method = "GET", body = null }) => {
    try {
        const reqParams = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (body) {
            reqParams.body = JSON.stringify(body);
        }

        return await fetch(`${RESOURSE_URL}${urlPath}`, reqParams);
    } catch (error) {
        console.error("HTTP ERROR: ", error);
    }
};

export const getAllsmartphones = async () => {
    const rawResponse = await baseRequest({ method: "GET" });

    return await rawResponse.json();
};

export const postsmartphone = (body) => baseRequest({ method: "POST", body });

export const updatesmartphone = (id, body) =>
    baseRequest({ urlPath: `/${id}`, method: "PATCH", body });
