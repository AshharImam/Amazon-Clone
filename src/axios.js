import axios from "axios";

const instance = axios.create({
  baseURL: "http://94.200.123.222:5005/",
});

export default instance;
