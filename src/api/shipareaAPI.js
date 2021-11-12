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
}

export default shipareaAPI;