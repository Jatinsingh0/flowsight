"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    console.log("Login form submitted with data:", { email: data.email, password: "***" });
    setIsLoading(true);
    setError(null);

    try {
      console.log("Making fetch request to /api/auth/login");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: Include cookies
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        setError(result.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Check if Set-Cookie header is present (may be null due to browser security)
      const setCookieHeader = response.headers.get("set-cookie");
      console.log("Set-Cookie header:", setCookieHeader);

      // Small delay to ensure cookie is set before redirect
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Verify cookie is set (for debugging)
      console.log("All cookies after login:", document.cookie);

      // Redirect to homepage or the redirect URL
      // Use window.location for full page reload to ensure cookies are available
      const redirect = searchParams.get("redirect") || "/";
      console.log("Redirecting to:", redirect);
      window.location.href = redirect;
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please check the console for details.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card border-borderSubtle">
      <CardHeader>
        <CardTitle className="text-2xl font-space-grotesk text-textBase">Login</CardTitle>
        <CardDescription className="text-textMuted">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              console.log("Form submit event triggered");
              form.handleSubmit(onSubmit)(e);
            }} 
            className="space-y-4"
          >
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-textBase">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="bg-card border-borderSubtle text-textBase placeholder:text-textMuted"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-textBase">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-card border-borderSubtle text-textBase placeholder:text-textMuted pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textBase transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent-soft text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-textMuted">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-accent hover:text-accent-soft underline"
          >
            Register
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

