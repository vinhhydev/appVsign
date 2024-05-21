import wsStrings from './wsStrings';

// Modal Calendar
export const listQuy = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
];
export const listNam = [
  {label: '2022', value: '2022'},
  {label: '2023', value: '2023'},
  {label: '2024', value: '2024'},
  {label: '2025', value: '2025'},
  {label: '2026', value: '2026'},
  {label: '2027', value: '2027'},
  {label: '2028', value: '2028'},
  {label: '2029', value: '2029'},
  {label: '2030', value: '2030'},
  {label: '2031', value: '2031'},
  {label: '2032', value: '2032'},
  {label: '2033', value: '2033'},
  {label: '2034', value: '2034'},
  {label: '2035', value: '2035'},
  {label: '2036', value: '2036'},
  {label: '2037', value: '2037'},
  {label: '2038', value: '2038'},
  {label: '2039', value: '2039'},
  {label: '2040', value: '2040'},
];
// Tính thuế VAT
export const listMact = [
  {label: 'PN', value: 'PN'},
  {label: 'PC', value: 'PC'},
  {label: 'PK', value: 'PK'},
  {label: 'BN', value: 'BN'},
];
export const listFilterMV = [
  {label: '1. Trên 20 triệu', value: wsStrings.VSIGN_20TR},
  {label: '2. Kiểm tra rủi ro', value: wsStrings.VSIGN_RUIRO},
  {label: '3. Ngày kí khác ngày lập', value: wsStrings.VSIGN_NGAYKYLAP},
  {label: '4. Hoá đơn khống', value: wsStrings.VSIGN_HDKHONG},
  {label: '5. Đối chiếu với Email', value: wsStrings.VSIGN_DOICHIEUE},
  {label: '6. Kiểm tra huỷ', value: wsStrings.VSIGN_KTHUY},
  {label: '7. Kiểm tra điều chỉnh', value: wsStrings.VSIGN_KTDIEUCHINH},
  {label: '8. Không có PDF', value: wsStrings.VSIGN_KHONGPDF},
  {label: '9. Nhập xuất tồn', value: wsStrings.VSIGN_NXT, type: 'nxt'},
];
export const listFilterBR = [
  {label: '1. Nhập xuất tồn', value: wsStrings.VSIGN_NXT, type: 'nxt'},
  {
    label: '2. Doanh thu theo đối tượng',
    value: wsStrings.VSIGN_BHDT,
    type: 'bhdt',
  },
  {
    label: '3. Doanh thu theo vật tư',
    value: wsStrings.VSIGN_BHVT,
    type: 'bhvt',
  },
];
// Danh sách cty
export const listLoaihinh = [
  {label: 'Thương mại', value: 'TM'},
  {label: 'Dịch vụ', value: 'DV'},
  {label: 'Sản xuất', value: 'SX'},
  {label: 'Xây dựng', value: 'XD'},
];
export const listThongtu = [
  {label: '133', value: '133'},
  {label: '200', value: '200'},
];
export const listTinhtrang = [
  {label: 'Hoạt động', value: 'C'},
  {label: 'Không hoạt động', value: 'K'},
  {label: 'Ngưng', value: 'N'},
  {label: 'Sai Password', value: 'S'},
  {label: 'Cần đổi Password', value: 'D'},
];
// ĐKKD
export const listLoai = [
  {label: 'Mới', value: '1'},
  {label: 'Thay đổi', value: '2'},
];
export const listTinh = [
  {label: 'Hà Nội', value: '01'},
  {label: 'TP. Hồ Chí Minh', value: '03'},
  {label: 'Hải Phòng', value: '02'},
  {label: 'Đà Nẵng', value: '04'},
  {label: 'Hà Tây', value: '05'},
  {label: 'Nam Định', value: '06'},
  {label: 'Hà Nam', value: '07'},
  {label: 'Hải Dương', value: '08'},
  {label: 'Hưng Yên', value: '09'},
  {label: 'Thái Bình', value: '10'},
  {label: 'Long An', value: '11'},
  {label: 'Tiền Giang', value: '12'},
  {label: 'Bến Tre', value: '13'},
  {label: 'Đồng Tháp', value: '14'},
  {label: 'Vĩnh Long', value: '15'},
  {label: 'An Giang', value: '16'},
  {label: 'Kiên Giang', value: '17'},
  {label: 'Cần Thơ', value: '18'},
  {label: 'Cà Mau', value: '20'},
  {label: 'Trà Vinh', value: '21'},
  {label: 'Sóc Trăng', value: '22'},
  {label: 'Bắc Ninh', value: '23'},
  {label: 'Bắc Giang', value: '24'},
  {label: 'Vĩnh Phúc', value: '25'},
  {label: 'Phú Thọ', value: '26'},
  {label: 'Ninh Bình', value: '27'},
  {label: 'Thanh Hoá', value: '28'},
  {label: 'Nghệ An', value: '29'},
  {label: 'Hà Tĩnh', value: '30'},
  {label: 'Quảng Bình', value: '31'},
  {label: 'Quảng Trị', value: '32'},
  {label: 'Thừa Thiên Huế', value: '33'},
  {label: 'Bình Thuận', value: '34'},
  {label: 'TP. Vũng Tàu', value: '35'},
  {label: 'Đồng Nai', value: '36'},
  {label: 'Bình Dương', value: '37'},
  {label: 'Bình Phước', value: '38'},
  {label: 'Tây Ninh', value: '39'},
  {label: 'Quảng Nam', value: '40'},
  {label: 'Khánh Hoà', value: '42'},
  {label: 'Quảng Ngãi', value: '43'},
  {label: 'Phú Yên', value: '44'},
  {label: 'Ninh Thuận', value: '45'},
  {label: 'Thái Nguyên', value: '46'},
  {label: 'Bắc Cạn', value: '47'},
  {label: 'Cao Bằng', value: '48'},
  {label: 'Lạng Sơn', value: '49'},
  {label: 'Tuyên Quang', value: '50'},
  {label: 'Hà Giang', value: '51'},
  {label: 'Yên Bái', value: '52'},
  {label: 'Lào Cai', value: '53'},
  {label: 'Hoà Bình', value: '54'},
  {label: 'Sơn La', value: '55'},
  {label: 'Lai Châu', value: '56'},
  {label: 'Quảng Ninh', value: '57'},
  {label: 'Lâm Đồng', value: '58'},
  {label: 'Gia Lai', value: '59'},
  {label: 'Đắc Lắc', value: '60'},
  {label: 'Kom Tum', value: '61'},
  {label: 'Lai Châu', value: '62'},
  {label: 'Hậu Giang', value: '63'},
];
// EHĐ
export const listHTTT = [
  {label: 'TM/CK', value: 'TM/CK'},
  {label: 'TM', value: 'TM'},
  {label: 'CK', value: 'CK'},
];
export const listDoiTuong = [
  {label: 'Công Ty', value: 'Công Ty'},
  {label: 'Khách Lẻ', value: 'Khách Lẻ'},
];
// Hàng hoá
export const listThue = [
  {label: '10%', value: '10'},
  {label: '8%', value: '8'},
  {label: '5%', value: '5'},
  {label: '0%', value: '0'},
  {label: 'KCT', value: '-1'},
];
// Tư vấn thuế
export const listDanhxung = [
  {label: 'Anh', value: 'Anh'},
  {label: 'Chị', value: 'Chị'},
  {label: 'Ông', value: 'Ông'},
  {label: 'Bà', value: 'Bà'},
];
