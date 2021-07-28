import Cookies from "js-cookie"

// LOGOUT
export const logout = () => Cookies.remove('token');

// LOGIN STATUS
export const isLogin =  () => {

    if (Cookies.get('token') === undefined) return false;

        return true;

    
}
