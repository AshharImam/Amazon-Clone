import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001/clone-abac6/us-central1/api",
});

export default instance;
