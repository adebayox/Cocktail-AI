import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const notifyError = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    hideProgressBar: true,
    theme: "colored",
  });
};
export const notifySuccess = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    hideProgressBar: true,
    theme: "colored",
  });
};
export const notifyInfo = (message, time = 3000) => {
  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: time,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    hideProgressBar: true,
    theme: "colored",
  });
};
