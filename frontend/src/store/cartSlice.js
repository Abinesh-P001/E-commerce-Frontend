import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/cart/items', { productId, quantity });
      dispatch(fetchCart());
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/cart/items/${itemId}`, { quantity });
      dispatch(fetchCart());
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      dispatch(fetchCart());
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/clear');
    return true;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    shippingAmount: 0,
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.shippingAmount = 0;
      state.total = 0;
      state.itemCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.subtotal = action.payload?.subtotal || 0;
        state.shippingAmount = action.payload?.shippingAmount || 0;
        state.total = action.payload?.total || 0;
        state.itemCount = action.payload?.itemCount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
        state.shippingAmount = 0;
        state.total = 0;
        state.itemCount = 0;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
