import { useState } from "react";
import "./DepartmentForm.scss";
import newRequest from "../../utils/newRequest";

const DepartmentForm = ({ updateListing }) => {
  const [departName, setDepartName] = useState("");

  const handleChange = (e) => {
    setDepartName(e.target.value);
  };

  const addDepartment = async () => {
    if (departName) {
      let resp = await newRequest.post("/department/add", {
        name: departName,
      });
      if (resp?.data?.success) {
        updateListing();
      }
    }
  };

  return (
    <div className='departmentForm'>
      <h2>Add New Department</h2>
      <div className='form-group'>
        <label htmlFor=''>Name:</label>
        <input type='text' onChange={handleChange} />
      </div>
      <button className='green' onClick={addDepartment}>
        Save Deparment
      </button>
    </div>
  );
};
export default DepartmentForm;
