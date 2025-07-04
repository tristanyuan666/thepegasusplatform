import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  console.log("=== TEST CHECKOUT FUNCTION CALLED ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    let body = {};

    // Only try to parse JSON for POST requests with content
    if (req.method === "POST") {
      const contentType = req.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (contentType?.includes("application/json")) {
        try {
          body = await req.json();
          console.log("Parsed request body:", body);
        } catch (parseError) {
          console.warn("Failed to parse JSON body:", parseError);
          body = { error: "Invalid JSON" };
        }
      }
    }

    const response = {
      success: true,
      message: "Test checkout function is working perfectly!",
      timestamp: new Date().toISOString(),
      method: req.method,
      body: body,
      environment: {
        STRIPE_SECRET_KEY: !!Deno.env.get("STRIPE_SECRET_KEY"),
        SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
        SUPABASE_SERVICE_KEY: !!Deno.env.get("SUPABASE_SERVICE_KEY"),
      },
      function_info: {
        name: "test-checkout",
        version: "1.0.0",
        runtime: "Deno",
        deno_version: Deno.version.deno,
      },
    };

    console.log("Sending successful response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Function-Status": "success",
      },
    });
  } catch (error) {
    console.error("=== TEST FUNCTION ERROR ===");
    console.error("Error type:", typeof error);
    console.error("Error:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown",
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );

    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      function_info: {
        name: "test-checkout",
        error_type: typeof error,
      },
    };

    console.log("Sending error response:", errorResponse);

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Function-Status": "error",
      },
    });
  }
});
