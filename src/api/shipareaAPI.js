import axiosClient from "./axiosClient";

const shipareaAPI = {
    index: () => {
        const url = '/shiparea/';
        return axiosClient.get(url);
    },

    getByStaff: (staffid, token) => {
        const url = `/shiparea/getbystaff/${staffid}`;
        return axiosClient.get(url, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    removeItem: (item, token) => {
        const url = `/shiparea/removeitem`;
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },

    addItem: (item, token) => {
        const url = `/shiparea/additem`;
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    }
}

export default shipareaAPI;