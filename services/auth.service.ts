import { authService } from './api.service';

const redirectUri = 'http://localhost:3000/callback';

export const getToken = async (code: string) => {
  const codeVerifier = localStorage.getItem('code_verifier');

  const body = {
    grant_type: 'authorization_code' || '',
    code: code || '',
    redirect_uri: redirectUri || '',
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
    code_verifier: codeVerifier || ''
  };

  try {
    const response = await authService.post('/api/token', body);
    const { access_token, refresh_token } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.log(err);
  }
};

export const refreshSpotifyToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');

  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
  };

  try {
    const response = await authService.post('/api/token', body);

    const { access_token, refresh_token } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.log(err);
  }
};
