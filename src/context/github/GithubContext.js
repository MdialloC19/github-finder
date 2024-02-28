import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const Github_URL = process.env.REACT_APP_GITHUB_URL;
const Github_Token = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialstate = {
    users: [],
    loading: false,
  };
  const [state, dispath] = useReducer(githubReducer, initialstate);

  const fetchUsers = async () => {
    setLoading();
    const response = await fetch(`${Github_URL}/users`, {
      headers: {
        Authorization: `token ${Github_Token}`,
      },
    });

    const data = await response.json();
    dispath({
      type: "GET_USERS",
      payload: data,
    });
  };
  const setLoading = () => {
    dispath({
      type: "SET_LOADING",
      payload: true,
    });
  };
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        fetchUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
