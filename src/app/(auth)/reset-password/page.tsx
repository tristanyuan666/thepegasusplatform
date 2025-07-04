"use client";

import { useState, useEffect } from "react";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { resetPasswordAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";

interface ResetPasswordProps {
  searchParams: Promise<Message & { success?: string; error?: string }>;
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Handle URL parameters for success and error messages
  useEffect(() => {
    const getParams = async () => {
      const params = await searchParams;
      const urlMessage = params.error
        ? { error: decodeURIComponent(params.error) }
        : params.success
          ? { success: decodeURIComponent(params.success) }
          : params;

      if (
        "error" in urlMessage ||
        "success" in urlMessage ||
        "message" in urlMessage
      ) {
        setMessage(urlMessage);
      }
    };
    getParams();
  }, [searchParams]);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);

    // Client-side validation
    if (password !== confirmPassword) {
      setMessage({ error: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ error: "Password must be at least 6 characters long" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPasswordAction(formData);
      if (result?.error) {
        setMessage({ error: result.error });
      } else {
        setMessage({
          success:
            "Password updated successfully! You can now sign in with your new password.",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage({ error: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-yellow-500";
    if (passwordStrength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your new password below
            </p>
          </div>

          <form action={handleSubmit} className="flex flex-col space-y-6">
            {message && (
              <div className="space-y-2">
                <FormMessage message={message} />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    disabled={isLoading}
                    className="w-full pr-10 hover-target interactive-element"
                    data-interactive="true"
                    aria-describedby="password_help password_error"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover-target interactive-element"
                    data-interactive="true"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${getStrengthColor().replace("bg-", "text-")}`}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Password should contain:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li
                          className={
                            password.length >= 6
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          At least 6 characters
                        </li>
                        <li
                          className={
                            /[A-Z]/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          One uppercase letter
                        </li>
                        <li
                          className={
                            /[0-9]/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          One number
                        </li>
                        <li
                          className={
                            /[^A-Za-z0-9]/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          One special character
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div
                  id="password_error"
                  className="text-xs text-red-600 hidden"
                  role="alert"
                >
                  Password must be at least 6 characters long
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm New Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pr-10 hover-target interactive-element"
                    data-interactive="true"
                    aria-describedby="confirm_password_error"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover-target interactive-element"
                    data-interactive="true"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    {password === confirmPassword ? (
                      <>
                        <Shield className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3 text-red-600" />
                        <span className="text-red-600">
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div
                  id="confirm_password_error"
                  className="text-xs text-red-600 hidden"
                  role="alert"
                >
                  Passwords do not match
                </div>
              </div>
            </div>

            <SubmitButton
              pendingText="Updating password..."
              className="w-full hover-target interactive-element"
              disabled={
                isLoading || password !== confirmPassword || password.length < 6
              }
              data-interactive="true"
              aria-label="Update password"
            >
              Update Password
            </SubmitButton>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Remember your password?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all hover-target interactive-element"
                  href="/sign-in"
                  data-interactive="true"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
