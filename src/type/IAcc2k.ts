export interface IAccountAcc2k {
  phoneNumber: string;
  password: string;
}

export interface IDropdownList {
  label: string;
  value: string;
}

export interface IDataCty {
  data: string;
  ma_cty: string;
  ten_cty: string;
}

export interface IDataBaoCao {
  barnum: number;
  bar: string;
  ham: string;
  ma: string;
  spud: string;
  excel: string;
}

export interface ILoadMoreTaiKhoan {
  tk: string;
  ten_tk: string;
  loai_tk: string;
  bac_tk: number;
  tk_me: string;
}

export interface ILoadMoreDoiTuong {
  ma_dt: string;
  ten_dt: string;
  dia_chi: string;
  ma_so_thue: string;
  loai_dt: string;
  ma_nh_dt: string;
}

export interface ILoadMoreVatTu {
  ma_vt: string;
  ten_vt: string;
  dvt: string;
  loai_vt: string;
  ma_nh: string;
}
