import axiosClient from "./axiosClient";

const feeshipAPI = {

    getAllByStaff: (item, token) => {
        const url = `/feeship/getallbystaff`;
        return axiosClient.post(url, item, {
            headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    },
}

export default feeshipAPI;