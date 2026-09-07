import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wishlist');
    return res.data.items;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { wishlist } = getState();
      const exists = wishlist.items.some((item) => item.productId === productId);
      if (exists) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post(`/wishlist/${productId}`);
      }
      dispatch(fetchWishlist());
      return { productId, exists: !exists };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
