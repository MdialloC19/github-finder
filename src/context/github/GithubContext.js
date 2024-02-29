import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const Github_URL = process.env.REACT_APP_GITHUB_URL;
const Github_Token = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialstate = {
    users: [],
    loading: false,
    error: "",
  };
  const [state, dispath] = useReducer(githubReducer, initialstate);

  const searchUsers = async (name) => {
    const params = new URLSearchParams({
      q: name,
    });
    try {
      setLoading();
      const response = await fetch(`${Github_URL}/search/users?${params}`, {
        headers: {
          Authorization: `token ${Github_Token}`,
        },
      });
      const { items } = await response.json();
      dispath({
        type: "GET_USERS",
        payload: items,
      });
    } catch (error) {
      dispath({
        type: "SET_ERROR",
        payload: error.message,
      });
    }
  };
  const clearUsers = () => {
    dispath({
      type: "CLEAR_USERS",
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
        searchUsers,
        clearUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
