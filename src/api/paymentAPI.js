import axiosClient from "./axiosClient";

const paymentApi = {
  index: () => {
    const url = '/payments/';
    return axiosClient.get(url);
  },

  statistic: (item, token) => {
    const url = '/payments/statistic';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
    });
  },

  payCODShipper: (item, token) => {
    const url = '/payments/paycodshipper';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
    });
  },

  getFastShipper: (item, token) => {
    const url = '/payments/getfastshipper';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
    });
  },

  getStandardShipper: (item, token) => {
    const url = '/payments/getstandardshipper';
    return axiosClient.post(url, item, {headers: {
      "Content-type": "Application/json",
      "Authorization": `Bearer ${token}`
      }   
    });
  },
}

export default paymentApi;