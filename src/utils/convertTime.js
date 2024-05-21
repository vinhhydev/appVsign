import moment from 'moment-timezone';

export const convertTime = gmtTime => {
  const vietnamTime = moment(gmtTime)
    .tz('Asia/Ho_Chi_Minh')
    .format('YYYY-MM-DD');
  return vietnamTime;
};
