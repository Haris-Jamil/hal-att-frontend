import "./UserList.scss";
import { RiDeleteBin2Line, RiEdit2Line } from "react-icons/ri";

const UserList = ({ users, openEditForm, openDeleteDialog }) => {
  return (
    <div className='userlist'>
      <table className='table'>
        <tbody>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Department</th>
            <th>Shift Start</th>
            <th>Shift End</th>
            <th>Daily Hours Required</th>
            <th>Actions</th>
          </tr>

          {users.map((user, idx) => {
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.department}</td>
                <td>{user.shiftStart}</td>
                <td>{user.shiftEnd}</td>
                <td>{user.requiredHours}</td>
                <td className='iconContainer'>
                  <RiEdit2Line
                    onClick={() => openEditForm(user._id)}
                    className='icon iconEdit'
                    size={22}
                  />
                  <RiDeleteBin2Line
                    onClick={() => openDeleteDialog("user", user._id)}
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
export default UserList;
