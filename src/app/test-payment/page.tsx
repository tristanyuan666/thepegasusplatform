"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "../../../supabase/client";
import {
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Database,
  Webhook,
  User,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error";
  message: string;
  details?: any;
}

interface PaymentTestData {
  user_id: string;
  email: string;
  plan_name: string;
  variant_id: string;
  billing_cycle: string;
}

export default function PaymentTestPage() {
  const [user, setUser] = useState<any>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [paymentTestData, setPaymentTestData] =
    useState<PaymentTestData | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setPaymentTestData({
          user_id: user.id,
          email: user.email || "test@example.com",
          plan_name: "Creator",
          variant_id: "123456", // Creator Monthly variant ID
          billing_cycle: "monthly",
        });
      }
    };
    getUser();
  }, []);

  const updateTestResult = (
    name: string,
    status: "pending" | "success" | "error",
    message: string,
    details?: any,
  ) => {
    setTestResults((prev) => {
      const existing = prev.find((r) => r.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.details = details;
        return [...prev];
      } else {
        return [...prev, { name, status, message, details }];
      }
    });
  };

  const runComprehensiveTest = async () => {
    if (!user) {
      alert("Please sign in first to run payment tests");
      return;
    }

    setIsRunningTests(true);
    setTestResults([]);

    try {
      // Test 1: Environment Variables
      updateTestResult(
        "Environment Check",
        "pending",
        "Checking environment variables...",
      );

      const envTest = await fetch("/api/health-check");
      if (envTest.ok) {
        updateTestResult(
          "Environment Check",
          "success",
          "API endpoint accessible",
        );
      } else {
        updateTestResult(
          "Environment Check",
          "error",
          "API endpoint not accessible",
        );
      }

      // Test 2: Supabase Connection
      updateTestResult(
        "Supabase Connection",
        "pending",
        "Testing database connection...",
      );

      const { data: testData, error: dbError } = await supabase
        .from("users")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (dbError) {
        updateTestResult(
          "Supabase Connection",
          "error",
          `Database error: ${dbError.message}`,
        );
      } else {
        updateTestResult(
          "Supabase Connection",
          "success",
          "Database connection successful",
        );
      }

      // Test 3: Diagnostic Function Test
      updateTestResult(
        "Diagnostic Function Test",
        "pending",
        "Testing diagnostic function...",
      );

      const { data: diagnosticData, error: diagnosticError } =
        await supabase.functions.invoke("diagnostic", {
          body: { test: true },
        });

      if (diagnosticError) {
        updateTestResult(
          "Diagnostic Function Test",
          "error",
          `Diagnostic error: ${diagnosticError.message}`,
        );
      } else if (diagnosticData?.success) {
        updateTestResult(
          "Diagnostic Function Test",
          "success",
          `Diagnostic successful - Environment check: ${JSON.stringify(diagnosticData.environment)}`,
          diagnosticData,
        );
      } else {
        updateTestResult(
          "Diagnostic Function Test",
          "error",
          "Diagnostic function returned unexpected response",
        );
      }

      // Test 4: Edge Function Connectivity
      updateTestResult(
        "Edge Function Test",
        "pending",
        "Testing Edge Function connectivity...",
      );

      const { data: edgeData, error: edgeError } =
        await supabase.functions.invoke("test-connection", {
          body: { test: true },
        });

      if (edgeError) {
        updateTestResult(
          "Edge Function Test",
          "error",
          `Edge Function error: ${edgeError.message}`,
        );
      } else if (edgeData?.success) {
        updateTestResult(
          "Edge Function Test",
          "success",
          "Edge Function connectivity confirmed",
        );
      } else {
        updateTestResult(
          "Edge Function Test",
          "error",
          "Edge Function returned unexpected response",
        );
      }

      // Test 5: Stripe Connection
      updateTestResult(
        "Stripe Connection",
        "pending",
        "Testing Stripe API connection...",
      );

      const { data: stripeData, error: stripeError } =
        await supabase.functions.invoke("test-new-stripe", {
          body: { test: true },
        });

      if (stripeError) {
        updateTestResult(
          "Stripe Connection",
          "error",
          `Stripe connection error: ${stripeError.message}`,
        );
      } else if (stripeData?.success) {
        updateTestResult(
          "Stripe Connection",
          "success",
          `Stripe connected - Account: ${stripeData.account_id}, Products: ${stripeData.products_count}, Prices: ${stripeData.prices_count}`,
          stripeData,
        );
      } else {
        updateTestResult(
          "Stripe Connection",
          "error",
          "Stripe connection failed",
        );
      }

      // Test 6: Variant ID Validation
      updateTestResult(
        "Variant Validation",
        "pending",
        "Validating Lemon Squeezy variant IDs...",
      );

      const variantIds = [
        "123456", // Creator Monthly - Replace with actual IDs
        "123457", // Creator Annual
        "123458", // Influencer Monthly
        "123459", // Influencer Annual
        "123460", // Superstar Monthly
        "123461", // Superstar Annual
      ];

      // For Lemon Squeezy, we'll just validate that the variant IDs are configured
      const configuredVariants = variantIds.filter((id) => id !== "123456" && id !== "123457" && id !== "123458" && id !== "123459" && id !== "123460" && id !== "123461");

      if (configuredVariants.length === variantIds.length) {
        updateTestResult(
          "Variant Validation",
          "success",
          `All ${variantIds.length} variant IDs are configured`,
        );
              } else {
          updateTestResult(
            "Variant Validation",
            "error",
            `Please replace placeholder variant IDs with actual Lemon Squeezy variant IDs`,
          );
        }

      // Test 7: Checkout Function Test
      updateTestResult(
        "Checkout Function",
        "pending",
        "Testing Lemon Squeezy checkout function...",
      );

      const { data: checkoutData, error: checkoutError } =
        await supabase.functions.invoke("create-checkout", {
          body: {
            test_mode: true,
            variant_id: paymentTestData?.variant_id,
            user_id: paymentTestData?.user_id,
            customer_email: paymentTestData?.email,
            plan_name: paymentTestData?.plan_name,
            billing_cycle: paymentTestData?.billing_cycle,
          },
        });

      if (checkoutError) {
        updateTestResult(
          "Checkout Function",
          "error",
          `Checkout function error: ${checkoutError.message}`,
        );
      } else if (checkoutData?.success && checkoutData?.test_mode) {
        updateTestResult(
          "Checkout Function",
          "success",
          "Checkout function working in test mode",
        );
      } else {
        updateTestResult(
          "Checkout Function",
          "error",
          "Checkout function test failed",
        );
      }
    } catch (error) {
      console.error("Test suite error:", error);
      updateTestResult(
        "Test Suite",
        "error",
        `Test suite failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsRunningTests(false);
    }
  };

  const testRealCheckout = async () => {
    if (!user || !paymentTestData) {
      alert("Please sign in first");
      return;
    }

    const confirmed = confirm(
      "This will create a REAL Lemon Squeezy checkout session. Are you sure you want to proceed? You can cancel on the Lemon Squeezy checkout page.",
    );

    if (!confirmed) return;

    try {
              const { data, error } = await supabase.functions.invoke(
          "create-checkout",
          {
            body: {
              variant_id: paymentTestData.variant_id,
              user_id: paymentTestData.user_id,
              customer_email: paymentTestData.email,
              plan_name: paymentTestData.plan_name,
              billing_cycle: paymentTestData.billing_cycle,
              return_url: `${window.location.origin}/success`,
              cancel_url: `${window.location.origin}/test-payment?cancelled=true`,
            },
          },
        );

      if (error) {
        alert(`Checkout error: ${error.message}`);
      } else if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("No checkout URL received");
      }
    } catch (error) {
      console.error("Real checkout error:", error);
      alert(
        `Checkout failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const getStatusIcon = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "pending":
        return "border-yellow-200 bg-yellow-50";
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              Payment System Test Suite
            </CardTitle>
            <p className="text-gray-600">
              Comprehensive testing for your new Stripe account integration
            </p>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    Signed in as: {user.email}
                  </p>
                  <p className="text-sm text-green-700">User ID: {user.id}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">
                    Please sign in to run tests
                  </p>
                  <p className="text-sm text-yellow-700">
                    Authentication required for payment testing
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={runComprehensiveTest}
                disabled={isRunningTests || !user}
                className="flex items-center gap-2"
              >
                {isRunningTests ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {isRunningTests ? "Running Tests..." : "Run All Tests"}
              </Button>

              <Button
                onClick={testRealCheckout}
                disabled={!user || isRunningTests}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Test Real Checkout
              </Button>
            </div>

            {paymentTestData && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Test Configuration:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Plan:</span>{" "}
                    {paymentTestData.plan_name}
                  </div>
                  <div>
                    <span className="font-medium">Billing:</span>{" "}
                    {paymentTestData.billing_cycle}
                  </div>
                  <div>
                    <span className="font-medium">Variant ID:</span>{" "}
                    {paymentTestData.variant_id}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {paymentTestData.email}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {result.name}
                          </h4>
                          <Badge
                            variant={
                              result.status === "success"
                                ? "default"
                                : result.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {result.message}
                        </p>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              View Details
                            </summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Update Environment Variables</h4>
                  <p className="text-sm text-gray-600">
                    Ensure LEMON_SQUEEZY_API_KEY and LEMON_SQUEEZY_WEBHOOK_SECRET are
                    updated
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Configure Lemon Squeezy Webhook</h4>
                  <p className="text-sm text-gray-600">
                    Set webhook URL to:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      https://epic-raman6-4uxp6.view-3.tempo-dev.app/functions/v1/payments-webhook
                    </code>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Test Payment Flow</h4>
                  <p className="text-sm text-gray-600">
                    Run all tests to verify the complete payment integration
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
