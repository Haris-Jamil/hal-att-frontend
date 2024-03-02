import moment from "moment";

export const padTime = (str) => {
  return str.toString().padStart(2, "0");
};

export const calculateDuration = (timeIn, timeOut, date, month, year) => {
  let time1 = moment(
    `${date}-${month}-${year} ` + timeIn,
    "DD-MM-YYYY HH:mm A"
  );

  let time2;
  if (timeOut.indexOf("AM") > -1) {
    const d = new Date(year, month - 1, date);
    d.setDate(d.getDate() + 1);
    time2 = moment(
      `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ` + timeOut,
      "DD-MM-YYYY HH:mm A"
    );
  } else {
    time2 = moment(`${date}-${month}-${year} ` + timeOut, "DD-MM-YYYY HH:mm A");
  }

  let diff = time2.diff(time1);
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
