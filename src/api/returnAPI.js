import axiosClient from "./axiosClient";

const returnAPI = {
    confirm: (item, token) => {
        const url = '/returns/confirm';
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    returned: (item, token) => {
        const url = '/returns/returned';
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

}

export default returnAPI;