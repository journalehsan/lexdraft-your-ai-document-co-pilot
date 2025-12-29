import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { initiateOAuthLogin } from "../oauthProviders";

export function SocialButtons() {
  return (
    <div className="grid grid-cols-5 gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => initiateOAuthLogin("google")}
        title="Sign in with Google"
        type="button"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => initiateOAuthLogin("microsoft")}
        title="Sign in with Microsoft"
        type="button"
      >
        <svg className="h-4 w-4" viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => initiateOAuthLogin("apple")}
        title="Sign in with Apple"
        type="button"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.96-.83 1.25.15 2.45.65 3.2 1.57-2.91 1.73-2.39 5.86.3 6.96-.54 1.57-1.32 3.12-2.54 4.53zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => initiateOAuthLogin("github")}
        title="Sign in with GitHub"
        type="button"
      >
        <Github className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => initiateOAuthLogin("linkedin")}
        title="Sign in with LinkedIn"
        type="button"
      >
        <Linkedin className="h-4 w-4 text-[#0077b5]" />
      </Button>
    </div>
  );
}
