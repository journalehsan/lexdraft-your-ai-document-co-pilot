import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Check } from "lucide-react";

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Simple password strength check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Start your 14-day free trial. No credit card required.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                placeholder="name@company.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                disabled={isLoading}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
               <div className="text-xs text-muted-foreground space-y-1 mt-1">
                  <div className={`flex items-center gap-1 ${hasMinLength ? "text-green-600" : ""}`}>
                    {hasMinLength ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? "text-green-600" : ""}`}>
                    {hasNumber ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                     Contains a number
                  </div>
                  <div className={`flex items-center gap-1 ${hasSpecial ? "text-green-600" : ""}`}>
                    {hasSpecial ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                     Contains a special character
                  </div>
               </div>
            </div>

             <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-start space-x-2">
                <Checkbox id="terms" required className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
                  </Label>
                </div>
            </div>

            <Button disabled={isLoading} isLoading={isLoading}>
              Create account
            </Button>
          </div>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SocialButtons />

        <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/app/login" className="font-semibold text-primary hover:underline">
                Sign in
            </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
