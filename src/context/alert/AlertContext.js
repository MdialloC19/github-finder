import { createContext, useReducer } from "react";
import AlertReducer from "./AlertReducer";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const initialstate = null;

  const [state, dispath] = useReducer(AlertReducer, initialstate);

  const setAlert = (msg, alert) => {
    dispath({
      type: "SET_ALERT",
      payload: { msg, alert },
    });

    setTimeout(() => dispatch({ type: "REMOVE_ALERT" }), 3000);
  };

  return (
    <AlertContext.Provider value={{ alert: state, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
