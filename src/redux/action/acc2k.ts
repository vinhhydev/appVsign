import {createAsyncThunk} from '@reduxjs/toolkit';
import getJSONByAPI from '../../utils/convertXML';
import axios from 'axios';
import {ehd2} from '../../../shared/url';
import wsStrings from '../../../shared/wsStrings';

// get data cty
export const getDataCty = createAsyncThunk(
  'getDataCty',
  async ({userName}: {userName: string}) => {
    let result;
    await axios.get(`${ehd2}${wsStrings.GETDATA}?tel=${userName}`).then(res => {
      result = getJSONByAPI(res.data);
    });
    return result;
  },
);

// login
export const loginAcc2k = createAsyncThunk(
  'loginAcc2k',
  async ({
    phoneNumber,
    password,
    data,
  }: {
    phoneNumber: string;
    password: string;
    data: string;
  }) => {
    await axios
      .post(
        `${ehd2}${wsStrings.CHECKLOGIN}`,
        {
          tel: phoneNumber,
          password,
          data,
        },
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(res => {
        console.log('RESULT', res);
      });
  },
);

// get bao cao con
export const getBaoCao = createAsyncThunk(
  'getBaoCao',
  async (idBaocao: number) => {
    let result;
    await axios
      .get(`${ehd2}${wsStrings.GETBAOCAO}?loai=${idBaocao}`)
      .then(rs => {
        result = getJSONByAPI(rs.data);
      });
    return result;
  },
);

// get list load more (tai khoan, doi tuong, vat tu)
export const getLoadMore = createAsyncThunk(
  'getLoadMore',
  async ({
    phoneNumber,
    password,
    data,
    typeList,
  }: {
    phoneNumber: string;
    password: string;
    data: string;
    typeList: string;
  }) => {
    let result;

    const url =
      typeList === 'dmtk'
        ? wsStrings.GETDMTK
        : typeList === 'dmdt'
        ? wsStrings.GETDMDT
        : wsStrings.GETDMVT;
    await axios
      .post(
        `${ehd2}${url}`,
        {
          tel: phoneNumber,
          password,
          data,
        },
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(res => {
        result = getJSONByAPI(res.data);
      });
    return result;
  },
);
