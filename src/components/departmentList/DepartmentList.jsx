import { RiDeleteBin2Line } from "react-icons/ri";
import "./DepartmentList.scss";

const DepartmentList = ({ departments, openDeleteDialog }) => {
  return (
    <div className='departmentList'>
      <table className='table'>
        <tbody>
          <tr>
            <th>#</th>
            <th>Department Name</th>
            <th>Actions</th>
          </tr>

          {departments.map((department, idx) => {
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{department.name}</td>
                <td className='iconContainer'>
                  <RiDeleteBin2Line
                    onClick={() =>
                      openDeleteDialog("department", department._id)
                    }
                    className='icon iconDelete'
                    size={22}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default DepartmentList;
