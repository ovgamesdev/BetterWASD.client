import { useContext } from "react";
import { AlertContext } from "../../contexts/AlertContext";

const useAlertAuth = () => {
  return useContext(AlertContext);
};

export default useAlertAuth;
