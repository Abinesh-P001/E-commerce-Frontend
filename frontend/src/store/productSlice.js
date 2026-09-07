import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const res = await api.get(`/products?${queryString}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/categories');
    return res.data.categories;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products || [];
        state.page = action.payload?.page || 1;
        state.total = action.payload?.total || 0;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default productSlice.reducer;
