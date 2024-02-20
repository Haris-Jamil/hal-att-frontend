import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://hal-att-backend.vercel.app/api/",
  withCredentials: true,
});

export default newRequest;
