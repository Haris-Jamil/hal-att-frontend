import { useEffect, useRef, useState } from "react";
import "./MonthView.scss";
import CalendarCell from "../../components/calendarCell/CalendarCell";
import { days, months } from "../../constants";
import Popup from "reactjs-popup";
import AttendanceEditForm from "../../components/attendanceEditForm/AttendanceEditForm";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const MonthView = () => {
  const date = new Date();
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentyear] = useState(date.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [leaves, setLeaves] = useState(0);
  const [absents, setAbsents] = useState(0);
  const [data, setData] = useState([]);
  const [monthLoaded, setMonthLoaded] = useState(true);
  const popupRef = useRef();
  const params = useParams();

  const loadUsers = async () => {
    const resp = await newRequest.get("/user/all");
    if (resp?.data) {
      const users = resp.data;
      setAllUsers(users);
      if (params.id) {
        setCurrentUser(users.filter((u) => u._id === params.id)[0]);
      } else {
        setCurrentUser(users[0]);
      }
    }
  };

  const loadMonth = async () => {
    if (!currentUser?._id) {
      return;
    }
    setMonthLoaded(false);
    const resp = await newRequest.get(
      `/attendance/month/${currentUser._id}/${currentMonth + 1}/${currentYear}`
    );
    setMonthLoaded(true);
    let monthData = resp?.data?.data;
    let obj = {};
    if (monthData) {
      for (let d of monthData) {
        obj[d.date] = d;
      }
    }
    renderCalendar(obj);
    popupRef?.current?.close();
  };

  const renderCalendar = async (dateData) => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    let dataTemp = Array(firstDay).fill(null);

    let leavesCount = 0,
      absentsCount = 0;
    const today = new Date();
    for (let i = 1; i < lastDate + 1; i++) {
      let data = {};
      if (
        i === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      ) {
        data.today = true;
      }

      let d = dateData[i];
      if (d) {
        dataTemp.push({ ...d, ...data, date: i });
        leavesCount += d.onLeave ? 1 : 0;
        absentsCount += d.isAbsent ? 1 : 0;
      } else {
        dataTemp.push({
          date: i,
          month: currentMonth + 1,
          year: currentYear,
          userId: currentUser?._id,
          ...data,
        });
      }
    }
    setLeaves(leavesCount);
    setAbsents(absentsCount);
    for (let i = data.length; i < 42; i++) {
      dataTemp.push(null);
    }

    setData(dataTemp);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadMonth();
  }, [currentMonth, currentUser]);

  const loadNextMonth = () => {
    setCurrentMonth((curr) => {
      if (curr === 11) {
        setCurrentyear(currentYear + 1);
        return 0;
      } else {
        return ++curr;
      }
    });
  };

  const loadPrevMonth = () => {
    setCurrentMonth((curr) => {
      if (curr === 0) {
        setCurrentyear(currentYear - 1);
        return 11;
      } else {
        return --curr;
      }
    });
  };

  const openPopup = (data) => {
    if (!data) return;
    setSelectedDate(data);
    if (data !== null && !data.timeIn && !data.timeOut) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
    popupRef?.current?.open();
  };

  const changeUser = (e) => {
    const id = e.target.value;
    setCurrentUser(allUsers.filter((u) => u._id === id)[0]);
  };

  return (
    <div className='monthView'>
      <div className='container'>
        <div className='controls'>
          <div className='userSelectContainer'>
            {allUsers && !!allUsers.length && (
              <>
                <label>Select User:</label>
                <select defaultValue={params.id} onClick={changeUser}>
                  {allUsers.map((user) => {
                    return (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
          </div>
          <div className='monthChanger'>
            <div className='monthControl'>
              <div className='caret' onClick={loadPrevMonth}>
                <RiArrowLeftSLine />
              </div>
              <div className='month'>
                <b>{months[currentMonth]} </b>
                {currentYear}
              </div>
              <div className='caret' onClick={loadNextMonth}>
                <RiArrowRightSLine />
              </div>
            </div>
          </div>
        </div>

        <div className='calendar'>
          <Popup ref={popupRef}>
            <AttendanceEditForm
              editMode={editMode}
              setEditMode={setEditMode}
              selectedDate={selectedDate}
              onSave={loadMonth}
            />
          </Popup>

          <div className='left'>
            <div className='userDetail'>
              <h3>{currentUser?.name}</h3>
              <h2>{currentUser?.department}</h2>
            </div>
            <div className='attDetail'>
              <div>
                {months[currentMonth]} {currentYear}
              </div>
              <div className='stat'>leaves: {leaves}</div>
              <div className='stat'>Absents: {absents}</div>
            </div>
          </div>
          <div className='right'>
            {monthLoaded ? (
              <>
                <div className='row'>
                  {days.map((day) => (
                    <div key={day} className='day'>
                      {day}
                    </div>
                  ))}
                </div>
                <div className='cellContainer'>
                  {[...Array(42)].map((_, i) => {
                    return (
                      <CalendarCell
                        key={i}
                        onCellClick={(data) => {
                          openPopup(data);
                        }}
                        data={data[i]}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <div className='loaderContainer'>
                <img src='./loader.svg' className='loader' alt='' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MonthView;
