import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDetailBlock.scss";
import newRequest from "../../utils/newRequest";

const UserDetailBlock = ({ _id, name, department }) => {
  let absent;
  let onLeave;
  let timeIn;
  let timeOut;

  const [data, setData] = useState({
    absent: false,
    onLeave: false,
    timeIn: "",
    timeOut: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    getTodaysAttendance();
  }, []);

  const getTodaysAttendance = async () => {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const resp = await newRequest.get(
      `/attendance/today/${_id}/${date}/${month}/${year}`
    );
    if (resp?.data?.success) {
      const today = resp?.data.today[0];
      setData({
        absent: !!today?.isAbsent,
        onLeave: !!today?.onLeave,
        timeIn: today?.timeIn,
        timeOut: today?.timeOut,
      });
    }
  };

  const gotoMonthView = () => {
    navigate(`/month/${_id}`);
  };

  return (
    <div className='userDetailBlock'>
      <div className='container' onClick={gotoMonthView}>
        <div className='detail'>
          <span>{name}</span>
          <span className='department'>{department}</span>
        </div>
        {data.absent && <div className='status absent'>Absent</div>}

        {data.onLeave && <div className='status leave'>On Leave</div>}

        {!data.absent && !data.onLeave && (
          <div
            className={"status " + (data.timeIn || data.timeOut ? "time" : "")}
          >
            {data.timeIn && <span>{data.timeIn}</span>}
            {data.timeOut && <span>{data.timeOut}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
export default UserDetailBlock;
