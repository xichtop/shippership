import axiosClient from "./axiosClient";

const shipperAPI = {

  login: (item) => {
    const url = '/shippers/login';
    return axiosClient.post(url, item);
  },

  addItem: (item) => {
    const url = '/shippers/additem';
    return axiosClient.post(url, item);
  },

  check: (item) => {
    const url = `/shippers/check/${item}`;
    return axiosClient.get(url);
  }

}

export default shipperAPI;