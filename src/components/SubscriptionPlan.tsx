
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubscriptionPlanProps {
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

const SubscriptionPlan = ({ name, price, duration, features, popular = false }: SubscriptionPlanProps) => {
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
        >
          Subscribe Now
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
