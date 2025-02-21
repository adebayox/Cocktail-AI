import Modal from "./Modal";
import { AnimatePresence, motion } from "framer-motion";

const Overlay = ({ children, fullWidth, openState, closeModal }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {openState ? (
          <div className="fixed min-h-screen min-w-sreen inset-0 grid place-items-center z-10">
            <div
              className="absolute inest-0 min-h-screen min-w-sreen w-full  bg-[rgba(0,0,0,0.5)] h-full"
              onClick={closeModal}
            ></div>
            <motion.div
              className={`relative p-3 bg-white rounded-lg overflow-y-scroll max-h-[96vh] disable-scroll ${
                fullWidth ? "max-w-4xl" : "max-w-[300px]"
                // fullWidth ? "max-w-6xl" : "max-w-[420px]"
              } w-full z-20`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <Modal fullWidth={fullWidth} closeModal={closeModal}>
                {children}
              </Modal>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Overlay;
