let API = "https://ethics-explore-travel-social-hub-backend.onrender.com";

export const setGlobalVariable = (value) => {
  API = value;
};

export const getGlobalVariable = () => {
  return API;
};
