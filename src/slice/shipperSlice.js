import { createSlice } from '@reduxjs/toolkit';

const initialShipper = {
  shipper: {
    StaffId: '',
    Email: '',
    Username: '',
    FullName: '',
    Phone: '',
    IdentityId: '',
    AccountBank: '',
    Address: '',
    Picture: '',
    Status: '',
    Role: ''
  },
  token: '',
};

const Shipper = createSlice({
  name: 'Store',
  initialState: initialShipper,
  reducers: {
    login: (state, action) => {
      // const newProduct = action.payload;
        return {...action.payload}
    },

    logout: () => {
        // const newProduct = action.payload;
        return initialShipper;
    },

    update: (state, action) => {
      // const newProduct = action.payload;
      return {...action.payload};
  },
  }
});

// export const { cartReducer } = cart;
const { reducer, actions } = Shipper;
export const { login,  logout, update} = actions;
export default reducer;