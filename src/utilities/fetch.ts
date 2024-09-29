import axios from "axios";

const fetch = axios.create({
  // baseURL: "http://192.168.86.192:3000",
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

export default fetch;
