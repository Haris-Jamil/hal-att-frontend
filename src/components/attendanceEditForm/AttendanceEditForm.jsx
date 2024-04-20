import "./AttendanceEditForm.scss";
import {
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiDeleteBin2Line,
  RiEdit2Line,
} from "react-icons/ri";
import { useState } from "react";
import newRequest from "../../utils/newRequest";
import Inputmask from "inputmask";
import { useEffect } from "react";

const AttendanceEditForm = ({
  editMode,
  selectedDate,
  setEditMode,
  onSave,
}) => {
  const [formData, setFormData] = useState(selectedDate);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    initInputMask();
  }, [editMode]);

  const initInputMask = () => {
    Inputmask("99:99 aM").mask("#timeIn");
    Inputmask("99:99 aM").mask("#timeOut");
  };

  const handleChange = (e) => {
    const data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  const handleCheckboxChange = (e) => {
    const data = { ...formData };
    data[e.target.name] = !!e.target.checked;
    setFormData(data);
  };

  const save = async () => {
    if (selectedDate._id) {
      const resp = await newRequest.post(
        `/attendance/update/${selectedDate._id}`,
        formData
      );
      if (resp?.data?.success) {
        onSave();
      }
    } else {
      setSaving(true);
      const resp = await newRequest.post("/attendance/add", formData);
      setSaving(false);
      if (resp?.data?.success) {
        onSave();
      }
    }
  };

  const deleteAtt = async () => {
    const resp = await newRequest.get(`/attendance/delete/${selectedDate._id}`);
    if (resp?.data?.success) {
      onSave();
    }
  };

  return (
    <div className='popUp'>
      <div>
        <h2>Edit Attendance</h2>
      </div>
      <div className='popupContent'>
        {editMode && (
          <>
            <div className='popupRow'>
              <div className='popupSection'>
                <h4>TIME IN</h4>
                <input
                  id='timeIn'
                  defaultValue={selectedDate.timeIn}
                  name='timeIn'
                  onChange={handleChange}
                />
              </div>
              <div className='popupSection'>
                <h4>TIME OUT</h4>
                <input
                  id='timeOut'
                  defaultValue={selectedDate.timeOut}
                  name='timeOut'
                  onChange={handleChange}
                />
              </div>
              <div className='actions'>
                {!saving ? (
                  <>
                    <div>
                      <RiCheckboxCircleLine size={28} onClick={save} />
                    </div>
                    <div>
                      <RiCloseCircleLine
                        size={28}
                        onClick={() => {
                          setEditMode(!editMode);
                        }}
                      />
                    </div>
                    <div>
                      <RiDeleteBin2Line size={28} onClick={deleteAtt} />
                    </div>
                  </>
                ) : (
                  <img src='./loader.svg' className='small-loader' alt='' />
                )}
              </div>
            </div>
            <div className='checkbox-row'>
              <div>
                <label>
                  <input
                    type='checkbox'
                    defaultChecked={selectedDate.onLeave}
                    name='onLeave'
                    onChange={handleCheckboxChange}
                  />
                  On Leave
                </label>
              </div>

              <div>
                <label>
                  <input
                    type='checkbox'
                    name='isAbsent'
                    defaultChecked={selectedDate.isAbsent}
                    onChange={handleCheckboxChange}
                  />
                  Is Absent
                </label>
              </div>
            </div>
          </>
        )}
        {!editMode && (
          <div className='popupRow'>
            <div className='popupSection'>
              <h4>TIME IN</h4>
              <span>{selectedDate && selectedDate.timeIn}</span>
            </div>
            <div className='popupSection'>
              <h4>TIME OUT</h4>
              <span>{selectedDate && selectedDate.timeOut}</span>
            </div>
            <div className='actions'>
              <div>
                <RiEdit2Line
                  size={28}
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AttendanceEditForm;
