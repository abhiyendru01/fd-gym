
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

interface SubscriptionPlanProps {
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

const SubscriptionPlan = ({ name, price, duration, features, popular = false }: SubscriptionPlanProps) => {
  const { user, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePayment = async (order_id: string, key_id: string, amount: number) => {
    const options = {
      key: key_id,
      amount: amount,
      currency: "INR",
      name: "FD GYM",
      description: `${name} Plan Subscription`,
      order_id: order_id,
      handler: async function (response: any) {
        setIsLoading(true);
        try {
          // Verify payment with our backend
          const { data, error } = await supabase.functions.invoke('verify-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            },
          });

          if (error) throw error;

          toast({
            title: "Payment Successful!",
            description: `You are now subscribed to the ${name} plan.`,
          });

          // Redirect to profile page after successful payment
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        } catch (error) {
          console.error('Payment verification error:', error);
          toast({
            title: "Payment Verification Failed",
            description: error.message || "There was an error verifying your payment.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },
      prefill: {
        name: user?.fullName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
      theme: {
        color: "#E11D48",
      },
    };

    // Initialize Razorpay
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  const handleSubscribe = async () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      // Ensure Razorpay script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay checkout script");
      }

      console.log("Creating subscription for user:", user.id);
      
      // Call the subscription edge function
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          user_id: user.id,
          plan_name: name,
          amount: price,
          duration
        },
      });

      if (error) {
        console.error("Subscription error:", error);
        throw error;
      }

      if (!data || !data.razorpay) {
        console.error("Invalid response from create-subscription:", data);
        throw new Error("Invalid response from server");
      }

      console.log("Subscription created successfully:", data);

      // Initialize Razorpay payment
      handlePayment(
        data.razorpay.order_id,
        data.razorpay.key_id,
        data.razorpay.amount
      );

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: error.message || "There was an error processing your subscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div 
      className={cn(
        "glassmorphism rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-10px] group relative",
        popular ? "border-fdgym-neon-red" : "border-fdgym-dark-gray"
      )}
    >
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-fdgym-neon-red text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="font-orbitron text-xl font-bold mb-2 group-hover:text-fdgym-neon-red transition-colors">
          {name}
        </h3>
        
        <div className="flex items-end mb-6">
          <span className="text-3xl font-bold">₹{price}</span>
          <span className="text-fdgym-light-gray ml-2">/{duration}</span>
        </div>
        
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-fdgym-red mr-2 shrink-0 mt-0.5" />
              <span className="text-fdgym-light-gray text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          className={cn(
            "w-full",
            popular 
              ? "bg-fdgym-neon-red hover:bg-fdgym-red text-white" 
              : "bg-fdgym-dark-gray hover:bg-fdgym-red text-white"
          )}
          onClick={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Subscribe Now"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
