export interface OAuthProvider {
  id: string;
  name: string;
  redirectUrl: string;
}

// OAuth provider configuration
// Note: These endpoints should be implemented on the backend
export const oauthProviders: Record<string, OAuthProvider> = {
  google: {
    id: 'google',
    name: 'Google',
    redirectUrl: '/app/auth/callback?provider=google',
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    redirectUrl: '/app/auth/callback?provider=microsoft',
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    redirectUrl: '/app/auth/callback?provider=apple',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    redirectUrl: '/app/auth/callback?provider=github',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    redirectUrl: '/app/auth/callback?provider=linkedin',
  },
};

// Placeholder function for OAuth login
// This will need to be connected to actual backend OAuth flow
export function initiateOAuthLogin(providerId: string) {
  const provider = oauthProviders[providerId];
  if (!provider) {
    console.error(`Unknown OAuth provider: ${providerId}`);
    return;
  }

  // For now, redirect to callback with provider info
  // In production, this should redirect to backend OAuth start endpoint
  const baseUrl = window.location.origin;
  window.location.href = `${baseUrl}${provider.redirectUrl}`;
}
