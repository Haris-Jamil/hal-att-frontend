import { useEffect, useState } from "react";
import "./AttendanceReport.scss";
import newRequest from "../../utils/newRequest";
import { calculateDuration, calculateDiff } from "../../utils.js";
const AttendanceReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setReport(resp.data.data);
    }
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
              report.map((r) => {
                return (
                  <tr key={r.date}>
                    <td>{`${r.date}/${r.month}/${r.year}`}</td>
                    <td>{`${r.timeIn ? r.timeIn : ""} - ${
                      r.timeOut ? r.timeOut : ""
                    }`}</td>
                    <td>
                      {r.timeIn && r.timeOut
                        ? calculateDuration(r.timeIn, r.timeOut)
                        : "--"}
                    </td>
                    <td>{`${currentUser.requiredHours}`}</td>
                    <td>
                      {r.timeIn && r.timeOut
                        ? calculateDiff(
                            calculateDuration(r.timeIn, r.timeOut),
                            currentUser.requiredHours
                          )
                        : "--"}
                    </td>
                    <td>{r.onLeave ? "yes" : "no"}</td>
                    <td>{r.isAbsent ? "yes" : "no"}</td>
                  </tr>
                );
              })
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
