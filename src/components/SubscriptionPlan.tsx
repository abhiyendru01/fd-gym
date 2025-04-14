
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

  const handleSubscribe = async () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Login Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the subscription edge function
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          user_id: user.id,
          plan_name: name,
          amount: price,
          duration
        },
      });

      if (error) throw error;

      toast({
        title: "Subscription Successful!",
        description: `You are now subscribed to the ${name} plan.`,
      });

      // Refresh the page to show updated subscription status
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);

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
