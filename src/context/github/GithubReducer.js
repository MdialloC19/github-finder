import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

/**
 * Contexte GitHub pour partager l'état et les fonctions liées à l'API GitHub.
 */
const GithubContext = createContext();

// Variables d'environnement pour l'API GitHub
const Github_URL = process.env.REACT_APP_GITHUB_URL;
const Github_Token = process.env.REACT_APP_GITHUB_TOKEN;

/**
 * Fournisseur du contexte GitHub.
 * Fournit l'état global et les fonctions pour interagir avec l'API GitHub.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants à encapsuler.
 * @returns {React.ReactNode} Le fournisseur du contexte.
 */
export const GithubProvider = ({ children }) => {
  // État initial
  const initialstate = {
    users: [], // Liste des utilisateurs trouvés
    user: {}, // Détails d'un utilisateur spécifique
    loading: false, // Indicateur de chargement
    error: "" // Message d'erreur
  };

  // Hook useReducer pour gérer l'état avec githubReducer
  const [state, dispath] = useReducer(githubReducer, initialstate);

  /**
   * Recherche des utilisateurs via l'API GitHub.
   *
   * @async
   * @function
   * @param {string} name - Le nom ou le mot-clé à rechercher.
   * @returns {Promise<void>}
   */
  const searchUsers = async name => {
    const params = new URLSearchParams({
      q: name
    });

    try {
      setLoading();

      const response = await fetch(`${Github_URL}/search/users?${params}`, {
        headers: {
          Authorization: `token ${Github_Token}`
        }
      });

      const { items } = await response.json();
      dispath({
        type: "GET_USERS",
        payload: items
      });
    } catch (error) {
      dispath({
        type: "SET_ERROR",
        payload: error.message
      });
    }
  };

  /**
   * Récupère les détails d'un utilisateur spécifique via l'API GitHub.
   *
   * @async
   * @function
   * @param {string} login - Le nom d'utilisateur GitHub.
   * @returns {Promise<void>}
   */
  const getUser = async login => {
    try {
      setLoading();

      const response = await fetch(`${Github_URL}/users/${login}`, {
        headers: {
          Authorization: `token ${Github_Token}`
        }
      });

      // Redirige si l'utilisateur n'est pas trouvé
      if (response.statusCode === 404) {
        window.location = "/notfound";
      } else {
        const data = await response.json();
        dispath({
          type: "GET_USER",
          payload: data
        });
      }
    } catch (error) {
      dispath({
        type: "SET_ERROR",
        payload: error.message
      });
    }
  };

  /**
   * Efface la liste des utilisateurs dans l'état global.
   */
  const clearUsers = () => {
    dispath({
      type: "CLEAR_USERS"
    });
  };

  /**
   * Active l'indicateur de chargement dans l'état global.
   */
  const setLoading = () => {
    dispath({
      type: "SET_LOADING",
      payload: true
    });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users, // Liste des utilisateurs
        loading: state.loading, // Indicateur de chargement
        user: state.user, // Détails de l'utilisateur
        searchUsers, // Fonction pour rechercher des utilisateurs
        getUser, // Fonction pour obtenir les détails d'un utilisateur
        clearUsers // Fonction pour effacer les utilisateurs
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
