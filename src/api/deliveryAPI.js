import axiosClient from "./axiosClient";

const deliveryApi = {
  index: () => {
    const url = '/deliveries/';
    return axiosClient.get(url);
  },

  getById: (deliveryId, token) => {
    const url = `/deliveries/getbyidshipper/${deliveryId}`;
    return axiosClient.get(url, {
      headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  },

  getFastShip: (staffId, token) => {
    const url = `/deliveries/getfastship/${staffId}`;
    return axiosClient.get(url, {
      headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  },

  getStandardShipOrder: (staffId, token) => {
    const url = `/deliveries/getstandardshiporder/${staffId}`;
    return axiosClient.get(url, {
      headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  },

  getStandardShipDeliver: (staffId, token) => {
    const url = `/deliveries/getstandardshipdeliver/${staffId}`;
    return axiosClient.get(url, {
      headers: {
        "Content-type": "Application/json",
        "Authorization": `Bearer ${token}`
      }
    });
  },

  // updateStatus: (item, token) => {
  //   const url = '/deliveries/update';
  //   return axiosClient.post(url, item, {headers: {
  //     "Content-type": "Application/json",
  //     "Authorization": `Bearer ${token}`
  //     }   
  // });
  // },


}

export default deliveryApi;