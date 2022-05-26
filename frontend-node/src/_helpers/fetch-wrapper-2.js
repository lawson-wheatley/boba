import { Component } from 'react';
import { history } from '../_helpers';
import { authAtom } from '../_state';

export { useFetchWrapper };

/*
class fetchWrapper extends Component{
    constructor(props){
        super(props);
        this.state = {
            auth: JSON.parse(localStorage.getItem('user'))
        }
        this.return = {
            get: this.request('GET'),
            post: this.request('POST'),
            put: this.request('PUT'),
            delete: this.request('DELETE')
        };
        this.request = this.request.bind(this);
        this.authHeader = this.authHeader.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }
    request(method){
        return (url, body) => {
            const requestOptions = {
                headers: this.authHeader(url)
            }
            if(body){
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = JSON.stringify(body);
            }
        }
    }
}*/
function useFetchWrapper() {
    const [auth, setAuth] = useRecoilState(authAtom);

    return {
        get: request('GET'),
        post: request('POST'),
        put: request('PUT'),
        delete: request('DELETE')
    };

    function request(method) {
        return (url, body) => {
            const requestOptions = {
                method,
                headers: authHeader(url)
            };
            if (body) {
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = JSON.stringify(body);
            }
            console.log(requestOptions);
            return fetch(url, requestOptions).then(handleResponse);
        }
    }
    
    // helper functions
    
    function authHeader(url) {
        // return auth header with jwt if user is logged in and request is to the api url
        const token = JSON.parse(localStorage.getItem('user'));
        const isLoggedIn = !!token;
        const isApiUrl = true
        if (isLoggedIn && isApiUrl) {
            return { Authorization: `Bearer ${token.access_token}` };
        } else {
            return {};
        }
    }
    
    function handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if ([401, 403].includes(response.status) && auth?.token) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    localStorage.removeItem('user');
                    setAuth(null);
                    history.push('/login');
                }
    
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
    
            return data;
        });
    }    
}