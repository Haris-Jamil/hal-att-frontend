import "./Login.scss";
import { useState } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("tii-att-user");

  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const login = async (e) => {
    e.preventDefault();
    const response = await newRequest.post("/auth/login", loginData);
    if (!response.data.success) {
      setError(response.data.error);
    } else {
      localStorage.setItem("tii-att-user", "admin");
      navigate("/");
    }
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    setLoginData({ ...loginData, [name]: e.target.value });
  };

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <div className='login'>
      <form className='container' onSubmit={login}>
        <h2>Admin Login</h2>
        <div className='form-group'>
          <label>Username:</label>
          <input name='username' type='text' onChange={handleInputChange} />
        </div>

        <div className='form-group'>
          <label>Password:</label>
          <input name='password' type='password' onChange={handleInputChange} />
        </div>
        {error && <span className='formError'>{error}</span>}
        <button type='submit' className='green loginBtn'>
          login
        </button>
      </form>
    </div>
  );
};
export default Login;
