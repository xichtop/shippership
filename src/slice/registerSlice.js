import { createSlice } from '@reduxjs/toolkit';

const initialShipper = {
  shipper: {
    StaffId: '',
    Email: '',
    Username: '',
    FullName: '',
    Phone: '',
    FirstIdentity: '',
    SecondIdentity: '',
    AccountBank: '',
    ProvinceCode: '',
    DistrictCode: '',
    WardCode: '',
    AddressDetail: '',
    Picture: '',
    Status: '',
  },
  bank: '',
  identity: '',
};

const Shipper = createSlice({
  name: 'Shipper',
  initialState: initialShipper,
  reducers: {
    create: (state, action) => {
        return {...action.payload}
    },

    refresh: () => {
        return initialShipper;
    },

    update: (state, action) => {
      return {...state, ...action.payload};
  },
  }
});

// export const { cartReducer } = cart;
const { reducer, actions } = Shipper;
export const { create,  refresh, update} = actions;
export default reducer;