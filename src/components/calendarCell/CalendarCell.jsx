import "./CalendarCell.scss";
import { calculateDuration } from "../../utils";

const CalendarCell = ({ data, onCellClick }) => {
  console.log(data);
  return (
    <div className='cell' onClick={() => onCellClick(data)}>
      <div className={data ? "active " + (data.today ? "today" : "") : ""}>
        {data && (
          <>
            <div className='dateText'>{data.date}</div>

            {(data.timeIn || data.timeOut) && (
              <div className='banner shift'>
                <span className='total'>
                  {data.timeIn} - {data.timeOut}
                </span>
              </div>
            )}

            {data.timeIn && data.timeOut && (
              <div className='banner totalTime'>
                <span className='total'>
                  {calculateDuration(
                    data.timeIn,
                    data.timeOut,
                    data.date,
                    data.month,
                    data.year
                  )}
                </span>
              </div>
            )}
            {data.isAbsent && <div className='banner absent'>Absent</div>}
            {data.onLeave && <div className='banner leave'>On Leave</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarCell;
