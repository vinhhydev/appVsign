import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {
  IDataCty,
  ILoadMoreDoiTuong,
  ILoadMoreTaiKhoan,
  ILoadMoreVatTu,
} from '../../type/IAcc2k';
import {DataBaoCao} from '../../screens/Acc2k';
import {getBaoCao, getDataCty, getLoadMore, loginAcc2k} from '../action/acc2k';

interface Acc2kState {
  dataCty: IDataCty[];
  dataBaocao: DataBaoCao[];
  loadMoreTaiKhoan: ILoadMoreTaiKhoan[];
  loadMoreDoiTuong: ILoadMoreDoiTuong[];
  loadMoreVatTu: ILoadMoreVatTu[];
  selectData: IDataCty;
  isLoading: boolean;
  isLoadingLogin: boolean;
  error: string;
}

export const initialState: Acc2kState = {
  dataCty: [],
  dataBaocao: [],
  loadMoreTaiKhoan: [],
  loadMoreDoiTuong: [],
  loadMoreVatTu: [],
  selectData: {
    data: '',
    ma_cty: '',
    ten_cty: '',
  },
  isLoading: false,
  isLoadingLogin: false,
  error: '',
};

const acc2kSlice = createSlice({
  name: 'acc2kSlice',
  initialState,
  reducers: {
    selectData: (state, action) => void (state.selectData = action.payload),
  },
  extraReducers: builder => {
    builder
      .addCase(getDataCty.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getDataCty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dataCty = action.payload as any;
        state.error = '';
      })
      .addCase(getDataCty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as any;
      })
      .addCase(getBaoCao.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getBaoCao.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dataBaocao = action.payload as any;
        state.error = '';
      })
      .addCase(getBaoCao.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as any;
      })
      .addCase(loginAcc2k.pending, state => {
        state.isLoadingLogin = true;
        state.error = '';
      })
      .addCase(loginAcc2k.fulfilled, state => {
        state.isLoadingLogin = false;
        state.error = '';
      })
      .addCase(loginAcc2k.rejected, (state, action) => {
        state.isLoadingLogin = false;
        state.error = action.payload as any;
      })
      .addCase(getLoadMore.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getLoadMore.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.typeList === 'dmtk') {
          state.loadMoreTaiKhoan = action.payload as any;
        } else if (action.meta.arg.typeList === 'dmdt') {
          state.loadMoreDoiTuong = action.payload as any;
        } else {
          state.loadMoreVatTu = action.payload as any;
        }
        state.error = '';
      })
      .addCase(getLoadMore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as any;
      });
  },
});

export const Acc2kStore = (state: RootState) => state.acc2kSlice; // get state
export const {selectData} = acc2kSlice.actions;
export default acc2kSlice.reducer;
