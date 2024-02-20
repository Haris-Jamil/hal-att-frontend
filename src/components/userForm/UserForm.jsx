import { useEffect, useState } from "react";
import "./UserForm.scss";
import newRequest from "../../utils/newRequest";
import InputMask from "inputmask";

const UserForm = ({
  editMode,
  departmentList,
  updateListing,
  selectedUser,
}) => {
  const [user, setUser] = useState(
    editMode
      ? selectedUser
      : { department: departmentList.length ? departmentList[0].name : "" }
  );

  useEffect(() => {
    InputMask("99:99 aM").mask("#shiftStart");
    InputMask("99:99 aM").mask("#shiftEnd");
    InputMask("99:99").mask("#requiredHours");
  }, []);

  const handleChange = (e) => {
    const newUser = { ...user, [e.target.name]: e.target.value };
    setUser(newUser);
  };

  const saveUser = async () => {
    if (editMode) {
      const resp = await newRequest.post(`/user/edit/${user._id}`, user);
      if (resp?.data?.success) {
        updateListing();
      }
    } else {
      const resp = await newRequest.post("/user/add", user);
      if (resp?.data?.success) {
        updateListing();
      }
    }
  };

  return (
    <div className='userForm'>
      {editMode ? <h2>Edit User</h2> : <h2>Add New User</h2>}
      <div className='form-group'>
        <label>Name:</label>
        <input
          type='text'
          name='name'
          onChange={handleChange}
          defaultValue={user.name}
        />
      </div>

      <div className='form-group'>
        <label>Department:</label>
        <select
          name='department'
          onChange={handleChange}
          defaultValue={user.department}
        >
          {departmentList.map((d) => {
            return (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className='form-group'>
        <label>Shift Start:</label>
        <input
          id='shiftStart'
          name='shiftStart'
          onChange={handleChange}
          defaultValue={user.shiftStart}
        />
      </div>

      <div className='form-group'>
        <label htmlFor=''>Shift End:</label>
        <input
          id='shiftEnd'
          name='shiftEnd'
          onChange={handleChange}
          defaultValue={user.shiftEnd}
        />
      </div>

      <div className='form-group'>
        <label htmlFor=''>Required Hours:</label>
        <input
          id='requiredHours'
          name='requiredHours'
          onChange={handleChange}
          defaultValue={user.requiredHours}
        />
      </div>

      <button className='green' onClick={saveUser}>
        Save User
      </button>
    </div>
  );
};
export default UserForm;
