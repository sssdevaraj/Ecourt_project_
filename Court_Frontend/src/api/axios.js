import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,

  headers: {
    "Content-type": "application/json",
  },
});

export default axiosClient;
