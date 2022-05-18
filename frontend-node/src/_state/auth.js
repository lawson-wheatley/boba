import { atom } from 'recoil';

const authAtom = atom({
    key: 'access_token',
    // get initial state from local storage to enable user to stay logged in
    default: JSON.parse(localStorage.getItem('access_token'))
});

export { authAtom };