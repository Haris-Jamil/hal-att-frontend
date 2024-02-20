import { useRef, useState, useEffect } from "react";
import UserList from "../../components/userList/UserList";
import UserForm from "../../components/userForm/UserForm";
import "./Settings.scss";
import Popup from "reactjs-popup";
import ConfirmDelete from "../../components/confirmDelete/ConfirmDelete";
import DepartmentForm from "../../components/departmentForm/DepartmentForm";
import DepartmentList from "../../components/departmentList/DepartmentList";
import newRequest from "../../utils/newRequest";

const Settings = () => {
  const userFormRef = useRef();
  const departmentFormRef = useRef();
  const confirmDeleteRef = useRef();
  const [deleteDialogOptions, setDeleteDialogOptions] = useState(null);
  const [userEditMode, setUserEditMode] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);

  const openUserForm = (id) => {
    if (id) {
      setUserEditMode(true);
      setSelectedUser(users.filter((u) => u._id === id)[0]);
    } else {
      setUserEditMode(false);
      setSelectedUser(null);
    }
    userFormRef.current.open();
  };

  const openDepartmentForm = () => {
    departmentFormRef.current.open();
  };

  const closeDeleteDialog = () => {
    confirmDeleteRef.current.close();
  };

  const deleteUser = async (id) => {
    const resp = await newRequest.get(`/user/delete/${id}`);
    if (resp?.data?.success) {
      getAllUsers();
      closeDeleteDialog();
    }
  };

  const deleteDepartment = async (id) => {
    const resp = await newRequest.get(`/department/delete/${id}`);
    if (resp?.data?.success) {
      getAllDepartments();
      closeDeleteDialog();
    }
  };

  const openDeleteDialog = (type, deleteId) => {
    if (!deleteId) {
      return;
    }
    const options = {
      deleteId: deleteId,
    };
    switch (type) {
      case "user":
        setDeleteDialogOptions({
          ...options,
          question: "Are you sure you want to delete this user?",
          deleteFunc: deleteUser,
        });
        confirmDeleteRef.current.open();
        break;
      case "department":
        setDeleteDialogOptions({
          ...options,
          question: "Are you sure you want to delete this department?",
          deleteFunc: deleteDepartment,
        });
        confirmDeleteRef.current.open();
        break;
      default:
        setDeleteDialogOptions(null);
    }
  };

  const getAllDepartments = async () => {
    try {
      setDepartmentLoading(true);
      const departs = await newRequest.get("/department/all");
      setDepartmentLoading(false);
      setDepartments(departs.data);
    } catch (ex) {
      console.log(ex);
      setDepartments([]);
    }
  };

  const getAllUsers = async () => {
    try {
      setUserLoading(true);
      const users = await newRequest.get("/user/all");
      setUserLoading(false);
      setUsers(users.data);
    } catch (ex) {
      console.log(ex);
      setUsers([]);
    }
  };

  useEffect(() => {
    getAllDepartments();
    getAllUsers();
  }, []);

  return (
    <div className='settings'>
      <Popup ref={userFormRef}>
        <UserForm
          updateListing={() => {
            getAllUsers();
            userFormRef.current.close();
          }}
          selectedUser={selectedUser}
          departmentList={departments}
          editMode={userEditMode}
        />
      </Popup>
      <Popup ref={departmentFormRef}>
        <DepartmentForm
          updateListing={() => {
            getAllDepartments();
            departmentFormRef.current.close();
          }}
        />
      </Popup>
      <Popup ref={confirmDeleteRef}>
        <ConfirmDelete
          close={closeDeleteDialog}
          options={deleteDialogOptions}
        />
      </Popup>
      <div className='container'>
        <h2 className='container-title'>Manage Users</h2>
        <div className='btnContainer'>
          <button className='green' onClick={() => openUserForm(null)}>
            Add New User
          </button>
        </div>
        <div>
          <UserList
            users={users}
            openEditForm={openUserForm}
            openDeleteDialog={openDeleteDialog}
          />
          {userLoading && (
            <img src='./loader.svg' className='loader loader-center' alt='' />
          )}
        </div>
      </div>
      <div className='container'>
        <h2 className='container-title'>Manage Departments</h2>
        <div className='btnContainer'>
          <button className='green' onClick={() => openDepartmentForm()}>
            Add New Department
          </button>
        </div>
        <div>
          <DepartmentList
            departments={departments}
            openDeleteDialog={openDeleteDialog}
          />
          {departmentLoading && (
            <img src='./loader.svg' className='loader loader-center' alt='' />
          )}
        </div>
      </div>
    </div>
  );
};
export default Settings;
