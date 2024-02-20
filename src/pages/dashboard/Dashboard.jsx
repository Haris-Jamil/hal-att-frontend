import { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";
import UserDetailBlock from "../../components/userDetailBlock/UserDetailBlock";
import "./Dashboard.scss";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    getTodaysAttendance();
  }, []);

  const getTodaysAttendance = async () => {
    setDataLoading(true);
    const resp = await newRequest.get("/user/userByDepartment");
    setDataLoading(false);
    if (resp?.data?.success) {
      setData(resp.data.response);
    } else {
      setData([]);
    }
  };

  if (dataLoading) {
    return (
      <div className='dashboard'>
        <div className='container'>
          <img className='loader' src='./loader.svg' alt='' />
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard'>
      <div className='container'>
        <h2>Today's Attendance</h2>
        {data.map((d) => {
          return (
            <div className='subContainer' key={d.department}>
              <h3>{d.department}</h3>
              <div className='row'>
                {d.users.map((user) => {
                  return <UserDetailBlock key={user.name} {...user} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Dashboard;
