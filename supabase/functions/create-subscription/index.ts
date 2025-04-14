
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to calculate end date based on duration
function calculateEndDate(duration: string): Date {
  const now = new Date();
  
  switch (duration) {
    case "month":
      now.setMonth(now.getMonth() + 1);
      break;
    case "3 months":
      now.setMonth(now.getMonth() + 3);
      break;
    case "6 months":
      now.setMonth(now.getMonth() + 6);
      break;
    case "year":
      now.setFullYear(now.getFullYear() + 1);
      break;
    default:
      now.setMonth(now.getMonth() + 1); // Default to 1 month
  }
  
  return now;
}

// Razorpay order creation function
async function createRazorpayOrder(amount: number, receipt: string) {
  const razorpayKey = Deno.env.get("RAZORPAY_KEY_ID");
  const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  
  if (!razorpayKey || !razorpaySecret) {
    throw new Error("Razorpay API keys are not configured");
  }
  
  const auth = btoa(`${razorpayKey}:${razorpaySecret}`);
  
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${auth}`
    },
    body: JSON.stringify({
      amount: amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: receipt,
      payment_capture: 1
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Razorpay API error: ${JSON.stringify(errorData)}`);
  }
  
  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  
  try {
    const { plan_name, amount, duration, user_id } = await req.json();
    
    // Validate required fields
    if (!plan_name || !amount || !duration || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );
    
    // Create Razorpay order
    const receipt = `sub_${user_id.substring(0, 8)}_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder(amount, receipt);
    
    // Calculate subscription end date
    const end_date = calculateEndDate(duration);
    
    // Create a pending subscription in the database
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id,
        plan_name,
        amount,
        duration,
        status: "pending", // Mark as pending until payment completes
        razorpay_order_id: razorpayOrder.id,
        end_date: end_date.toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Return the created subscription along with Razorpay order details
    return new Response(
      JSON.stringify({ 
        success: true, 
        subscription: data,
        razorpay: {
          order_id: razorpayOrder.id,
          key_id: Deno.env.get("RAZORPAY_KEY_ID"),
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Error creating subscription:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to create subscription",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
