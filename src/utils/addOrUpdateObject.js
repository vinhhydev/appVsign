// Xử lý khi chọn hàng hoá thêm vào list nếu trùng với hàng hoá đã có sẵn trong list thì +1 số lượng

export const addOrUpdateObject = (arr, obj) => {
  const existingObjIndex = arr.findIndex(item => item.Ma_hang === obj.Ma_hang);
  if (existingObjIndex !== -1) {
    arr[existingObjIndex].So_luong += obj.So_luong;
    arr[existingObjIndex].Thue += obj.Thue;
    arr[existingObjIndex].Tien += obj.Tien;
  } else {
    arr.push(obj);
  }
  return arr;
};
