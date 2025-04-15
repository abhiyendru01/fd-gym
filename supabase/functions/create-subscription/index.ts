
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Razorpay } from "https://esm.sh/razorpay@2.9.2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  
  try {
    const { user_id, plan_name, amount, duration } = await req.json();
    
    // Validate required fields
    if (!user_id || !plan_name || !amount || !duration) {
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
    
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: 'rzp_test_kXdvIUTOdIictY', // Using test key
      key_secret: 'uBUhU4SyokQFhotGToLXRg6C', // Using test secret
    });
    
    // Calculate duration in days for end date
    let durationDays = 30; // default to 30 days for "month"
    if (duration === "3 months") {
      durationDays = 90;
    } else if (duration === "6 months") {
      durationDays = 180;
    } else if (duration === "year") {
      durationDays = 365;
    }
    
    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);
    
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay amount is in paise (1/100 of INR)
      currency: "INR",
      receipt: `fd-gym-${user_id.slice(0, 8)}`,
      notes: {
        plan_name,
        user_id,
      },
    });
    
    if (!order || !order.id) {
      throw new Error("Failed to create Razorpay order");
    }
    
    // Create subscription record in Supabase
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id,
        plan_name,
        amount,
        duration,
        status: "pending", // Will be updated to "active" after payment verification
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        razorpay_order_id: order.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({
        success: true,
        subscription: data,
        razorpay: {
          order_id: order.id,
          key_id: 'rzp_test_kXdvIUTOdIictY',
          amount: amount * 100,
        },
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
