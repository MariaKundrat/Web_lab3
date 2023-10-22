const BASE_URL = "http://localhost:5500/api";
const RESOURSE_URL = `${BASE_URL}/phone`;

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

export const getAllPhones = async () => {
    const rawResponse = await baseRequest({ method: "GET" });

    return await rawResponse.json();
};

export const postPhone = (body) => baseRequest({ method: "POST", body });

export const updatePhone = (id, body) =>
    baseRequest({ urlPath: `/${id}`, method: "PATCH", body });

export const deletePhone = (id) =>
    baseRequest({ urlPath: `/${id}`, method: "DELETE" });

async function initializeServerWithData() {
    const response = await fetch('http://localhost:5500/api/init', {
        method: 'POST',
    });

    if (response.ok) {
        console.log('Сервер ініціалізовано даними');
        displaySmartphones();
    } else {
        console.error('Помилка ініціалізації сервера');
    }
}

initializeServerWithData();