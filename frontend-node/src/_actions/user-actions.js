import { useSetRecoilState } from 'recoil';

import { history, useFetchWrapper } from '../_helpers';
import { authAtom, usersAtom } from '../_state';

export { useUserActions };

function useUserActions () {
    const baseUrl = process.env.REACT_APP_API_URL;
    const fetchWrapper = useFetchWrapper();
    const setAuth = useSetRecoilState(authAtom);
    const setUsers = useSetRecoilState(usersAtom);

    return {
        login,
        logout,
        getAll
    }

    function login(username, password) {
        return fetchWrapper.post(process.env.REACT_APP_API_URL+"/login", { username, password })
            .then(result => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(result));
                setAuth(result);
            });
    }

    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        localStorage.removeItem('user');
        setAuth(null);
        history.push('/login');
    }

    function getAll() {
        return fetchWrapper.get(baseUrl).then(setUsers);
    }    
}