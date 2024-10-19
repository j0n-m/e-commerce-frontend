import axios from "axios";

//backend "http://localhost:3000"
//frontend "http://localhost:5173"

export const backendURL = "http://192.168.86.193:3000";
// export const backendURL = "http://localhost:3000";

const fetch = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

export default fetch;
