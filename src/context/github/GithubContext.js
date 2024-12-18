import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

/**
 * Contexte GitHub pour partager l'état et les fonctions relatives à l'API GitHub.
 */
const GithubContext = createContext();

// URLs et tokens pour l'API GitHub (provenant des variables d'environnement)
const Github_URL = process.env.REACT_APP_GITHUB_URL;
const Github_Token = process.env.REACT_APP_GITHUB_TOKEN;

/**
 * Fournisseur du contexte GitHub.
 * Gère l'état global et fournit des fonctions pour interagir avec l'API GitHub.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants enveloppés par le fournisseur.
 * @returns {React.ReactNode} Le fournisseur du contexte GitHub.
 */
export const GithubProvider = ({ children }) => {
  // État initial
  const initialstate = {
    users: [], // Liste des utilisateurs trouvés
    user: {}, // Détails d'un utilisateur spécifique
    loading: false, // Indicateur de chargement
    error: "" // Message d'erreur
  };

  // Hook useReducer pour gérer l'état global à l'aide de githubReducer
  const [state, dispath] = useReducer(githubReducer, initialstate);

  /**
   * Recherche des utilisateurs GitHub par nom.
   *
   * @async
   * @function
   * @param {string} name - Le mot-clé ou nom à rechercher.
   * @returns {Promise<void>}
   */
  const searchUsers = async name => {
    const params = new URLSearchParams({
      q: name
    });

    try {
      setLoading(); // Active l'état de chargement

      const response = await fetch(`${Github_URL}/search/users?${params}`, {
        headers: {
          Authorization: `token ${Github_Token}`
        }
      });

      const { items } = await response.json(); // Extrait les utilisateurs de la réponse
      dispath({
        type: "GET_USERS",
        payload: items
      });
    } catch (error) {
      dispath({
        type: "SET_ERROR",
        payload: error.message // Enregistre l'erreur dans l'état global
      });
    }
  };

  /**
   * Récupère les détails d'un utilisateur GitHub spécifique.
   *
   * @async
   * @function
   * @param {string} login - Le nom d'utilisateur GitHub.
   * @returns {Promise<void>}
   */
  const getUser = async login => {
    try {
      setLoading(); // Active l'état de chargement

      const response = await fetch(`${Github_URL}/users/${login}`, {
        headers: {
          Authorization: `token ${Github_Token}`
        }
      });

      // Vérifie si l'utilisateur n'est pas trouvé
      if (response.statusCode === 404) {
        window.location = "/notfound"; // Redirection vers une page d'erreur
      } else {
        const data = await response.json();
        dispath({
          type: "GET_USER",
          payload: data // Met à jour les détails de l'utilisateur dans l'état
        });
      }
    } catch (error) {
      dispath({
        type: "SET_ERROR",
        payload: error.message // Enregistre l'erreur dans l'état global
      });
    }
  };

  /**
   * Efface la liste des utilisateurs trouvés.
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
        user: state.user, // Détails d'un utilisateur
        searchUsers, // Fonction pour rechercher des utilisateurs
        getUser, // Fonction pour obtenir les détails d'un utilisateur
        clearUsers // Fonction pour effacer la liste des utilisateurs
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
