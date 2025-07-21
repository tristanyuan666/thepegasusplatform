import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("=== DIAGNOSTIC FUNCTION CALLED ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));

    // Check all environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: {
        exists: !!Deno.env.get("STRIPE_SECRET_KEY"),
        length: Deno.env.get("STRIPE_SECRET_KEY")?.length || 0,
        prefix: Deno.env.get("STRIPE_SECRET_KEY")?.substring(0, 7) || "none",
      },
      STRIPE_WEBHOOK_SECRET: {
        exists: !!Deno.env.get("STRIPE_WEBHOOK_SECRET"),
        length: Deno.env.get("STRIPE_WEBHOOK_SECRET")?.length || 0,
        prefix:
          Deno.env.get("STRIPE_WEBHOOK_SECRET")?.substring(0, 7) || "none",
      },
      SUPABASE_URL: {
        exists: !!Deno.env.get("SUPABASE_URL"),
        value: Deno.env.get("SUPABASE_URL") || "none",
      },
      SUPABASE_SERVICE_KEY: {
        exists: !!Deno.env.get("SUPABASE_SERVICE_KEY"),
        length: Deno.env.get("SUPABASE_SERVICE_KEY")?.length || 0,
        prefix: Deno.env.get("SUPABASE_SERVICE_KEY")?.substring(0, 7) || "none",
      },
    };

    const response = {
      success: true,
      message: "Diagnostic function is working!",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      environment: envCheck,
      deno_info: {
        version: Deno.version.deno,
        v8: Deno.version.v8,
        typescript: Deno.version.typescript,
      },
      function_info: {
        name: "diagnostic",
        deployed: true,
        runtime: "Deno Edge Runtime",
      },
    };

    console.log("Diagnostic response:", JSON.stringify(response, null, 2));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("=== DIAGNOSTIC ERROR ===");
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
        name: "diagnostic",
        error_type: typeof error,
      },
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
