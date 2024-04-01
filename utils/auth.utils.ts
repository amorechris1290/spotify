const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateCodeChallenge = async (codeVerifier: string | undefined) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const redirectToSpotifyLogin = async () => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const state = generateRandomString(16);
  const scope =
    'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state user-library-read user-library-modify';

  localStorage.setItem('code_verifier', codeVerifier);

  const args = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
    scope: scope,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    state: state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
  });

  window.location.href = `${process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL}/authorize?${args}`;
};

export const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('code_verifier');
  window.dispatchEvent(new Event('storage'));
};
