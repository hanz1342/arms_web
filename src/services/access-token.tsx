import { getCookie } from 'cookies-next';

function getAccessToken(): string | undefined {
    return  getCookie('token');
};

export function getHeaders() {
    let accessToken = getAccessToken();
    if (accessToken) {
        return {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
    } else {
        return {
            'Content-Type': 'application/json',
        };
    }
};
