"use client";

import type React from "react";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // const { token } = await res.json();
      onSuccess();

      // Store token in a cookie (valid for 2 hours to match JWT expiry)
      // Cookies.set('admin_token', token, { expires: 1/12, secure: true })
    } else {
      setError("Invalid password");
    }
    setLoading(false);

    //   try {
    //     // For demo, accept "elvis123" as password
    //     if (password === "elvis123") {
    //       localStorage.setItem("adminToken", btoa(`admin:${password}`));
    //       onSuccess();
    //     } else {
    //       setError("Invalid password");
    //     }
    //   } catch (err) {
    //     setError("Login failed");
    //   } finally {
    //     setLoading(false);
    //   }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-accent/10">
      <Card className="w-full max-w-md border border-border bg-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            OAU ChowFinder
          </h1>
          <p className="text-muted-foreground">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Admin Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={loading}
              className="w-full"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          This is only for admins, do not share your password.
        </p>
      </Card>
    </div>
  );
}
