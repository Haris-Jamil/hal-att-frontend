import moment from "moment";

export const padTime = (str) => {
  return str.toString().padStart(2, "0");
};

export const calculateDuration = (timeIn, timeOut) => {
  const time1 = moment(timeIn, "HH:mm A");
  const time2 = moment(timeOut, "HH:mm A");

  const diff = time2.diff(time1);
  const duration = moment.duration(diff);
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes() % 60);
  return `${padTime(hours)}:${padTime(minutes)}`;
};

export const calculateDiff = (dayDuration, requiredHours) => {
  let isNegative = false;
  const time1 = moment(requiredHours, "HH:mm");
  const time2 = moment(dayDuration, "HH:mm");
  const diff = time2.diff(time1);

  const duration = moment.duration(diff);
  isNegative = duration.asHours() < 0 || duration.asMinutes() < 0;

  const hours = Math.floor(Math.abs(duration.asHours()));
  const minutes = Math.floor(Math.abs(duration.asMinutes()) % 60);
  return `${isNegative ? "-" : ""}${padTime(hours)}:${padTime(minutes)}`;
};
