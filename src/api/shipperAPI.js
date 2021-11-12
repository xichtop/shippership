import axiosClient from "./axiosClient";

const shipperAPI = {

  login: (item) => {
    const url = '/shippers/login';
    return axiosClient.post(url, item);
  },


}

export default shipperAPI;