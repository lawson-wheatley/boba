import { atom } from 'recoil';

const authAtom = atom({
    key: 'user',
    // get initial state from local storage to enable user to stay logged in
    default: JSON.parse(localStorage.getItem('user')).access_token
});

export { authAtom };