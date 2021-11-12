import axiosClient from "./axiosClient";

const coordinationAPI = {
    index: () => {
        const url = '/coordinations/';
        return axiosClient.get(url);
    },

    addFastItem: (item, token) => {
        const url = `/coordinations/addfastitem`;
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    addStandardItem: (item, token) => {
        const url = `/coordinations/addstandarditem`;
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    updateFastItem: (item, token) => {
        const url = `/coordinations/updatefastitem`;
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    updateStandardItem: (item, token) => {
        const url = `/coordinations/updatestandarditem`;
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    getFastShip: (staffId, token) => {
        const url = `/coordinations/getfastship/${staffId}`;
        return axiosClient.get(url, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    getStandardShip: (staffId, token, status) => {
        const url = `/coordinations/getstandardship/${staffId}/${status}`;
        return axiosClient.get(url, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },
}

export default coordinationAPI;