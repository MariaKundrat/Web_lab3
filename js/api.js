const BASE_URL = "http://localhost:3000/api";

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
        const endpointUrl = `${BASE_URL}${urlPath}`;

        const response = await fetch(endpointUrl, reqParams);
        const parsedData = response.json();
        console.log('parsedData: ', parsedData);
        
        return parsedData;  
    } catch (error) {
        console.error("HTTP ERROR: ", error);
    }
};

export const getAllPhones = async () => {
    const rawResponse = await baseRequest({ method: "GET" });

    return await rawResponse.json();
};

export const postPhone = (body) => baseRequest({ urlPath: "/smartphones", method: "POST", body });

export const updatePhone = (id, body) =>
    baseRequest({ urlPath: `/${id}`, method: "PUT", body });

export const deletePhone = (id) =>
    baseRequest({ urlPath: `/${id}`, method: "DELETE" });

export const initializeServerWithData = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/smartphones', {
            method: 'GET',
        });

        const json = await response.json(); 
        console.log('json: ', json);

        return json;
    } catch (error) {
        console.log('Помилка ініціалізації сервера', error);
    }
}