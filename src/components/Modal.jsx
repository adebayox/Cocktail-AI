import { FaTimes } from "react-icons/fa";

const Modal = ({ children, closeModal }) => {
  return (
    <div>
      <FaTimes
        size={16}
        className="absolute right-4 top-4"
        onClick={closeModal}
      />
      {children}
    </div>
  );
};

export default Modal;
