import { useEffect, useState } from "react";
import "./AttendanceReport.scss";
import newRequest from "../../utils/newRequest";
import { calculateDuration, calculateDiff } from "../../utils.js";
import moment from "moment";

const AttendanceReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalTime, setTotalTime] = useState("");

  const loadUsers = async () => {
    const resp = await newRequest.get("/user/all");
    if (resp?.data) {
      const users = resp.data;
      setAllUsers(users);
      setCurrentUser(users[0]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const fetchReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    const resp = await newRequest.get(
      `/attendance/month/${currentUser._id}/${selectedMonth}/${selectedYear}`
    );
    setLoading(false);
    if (resp?.data?.data) {
      let tempData = resp.data.data;
      tempData = tempData.map((d) => {
        let duration = "--";
        let diff = "--";
        if (d.timeIn && d.timeOut) {
          duration = calculateDuration(
            d.timeIn,
            d.timeOut,
            d.date,
            d.month,
            d.year
          );
          diff = calculateDiff(duration, currentUser.requiredHours);
        }
        return {
          ...d,
          duration,
          diff,
        };
      });
      setTotalTime(calculateTotalTime(tempData));
      setReport(tempData);
    }
  };

  const calculateTotalTime = (data) => {
    let totalDuration = moment.duration(0);
    for (let d of data) {
      if (d.diff.indexOf("-") === -1) {
        const newDuration = moment.duration(d.diff);
        totalDuration.add(newDuration);
      } else {
        const newDuration = moment.duration(d.diff.replace("-", ""));
        totalDuration.subtract(newDuration);
      }
    }
    let totalMinutes = totalDuration.asMinutes();
    const isNegative = totalMinutes < 0;
    totalMinutes = Math.abs(totalMinutes);

    let hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    let minutes = (totalMinutes % 60).toString().padStart(2, "0");

    return `${isNegative ? "-" : ""}${hours}:${minutes}`;
  };

  const handleMonthChange = (e) => {
    const val = e.target.value;
    const [year, month] = val.split("-");
    setSelectedMonth(Number(month));
    setSelectedYear(Number(year));
    setReport([]);
  };

  const handleUserChange = (e) => {
    const id = e.target.value;
    setCurrentUser(allUsers.filter((u) => u._id === id)[0]);
    setReport([]);
  };

  return (
    <div className='attendanceReport'>
      <div className='container'>
        <h1>Attendance Report</h1>
        <form className='monthForm' onSubmit={fetchReport}>
          <label>User:</label>
          <select name='users' id='users' onChange={handleUserChange}>
            {allUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          <label>Month:</label>
          <input
            className='monthField'
            type='month'
            onChange={handleMonthChange}
          />
          <button className='green' type='submit'>
            Search
          </button>
        </form>

        <table className='table'>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time Entries</th>
              <th>Hours Worked</th>
              <th>Required Time</th>
              <th>Over Time / Missing Time</th>
              <th>Leave</th>
              <th>Absent</th>
            </tr>
          </thead>

          <tbody>
            {!loading ? (
              <>
                {report.map((r) => {
                  return (
                    <tr key={r.date}>
                      <td>{`${r.date}/${r.month}/${r.year}`}</td>
                      <td>
                        {`${r.timeIn ? r.timeIn : ""} - ${
                          r.timeOut ? r.timeOut : ""
                        }`}
                      </td>
                      <td>{r.duration}</td>
                      <td>{`${currentUser.requiredHours}`}</td>
                      <td>{r.diff} </td>
                      <td>{r.onLeave ? "yes" : "no"}</td>
                      <td>{r.isAbsent ? "yes" : "no"}</td>
                    </tr>
                  );
                })}

                {report.length ? (
                  <tr style={{ backgroundColor: "#7bed9f" }}>
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{totalTime}</td>
                    <td></td>
                    <td></td>
                  </tr>
                ) : (
                  ""
                )}
              </>
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{ backgroundColor: "white", textAlign: "center" }}
                >
                  <img src='./loader.svg' className='loader' alt='' />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AttendanceReport;
