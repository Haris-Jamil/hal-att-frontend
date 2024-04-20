import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:5001/api/",
  withCredentials: true,
});

export default newRequest;
