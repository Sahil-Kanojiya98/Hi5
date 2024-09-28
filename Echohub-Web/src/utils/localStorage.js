const accessTokenKey = 'accessToken';

export const setAccessToken = (token) => {
    localStorage.setItem(accessTokenKey, token);
};
export const getAccessToken = () => {
    return localStorage.getItem(accessTokenKey);
};
export const removeAccessToken = () => {
    localStorage.removeItem(accessTokenKey);
};
