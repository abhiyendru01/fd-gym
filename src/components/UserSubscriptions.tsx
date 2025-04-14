
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

type Subscription = {
  id: string;
  plan_name: string;
  amount: number;
  duration: string;
  status: string;
  start_date: string;
  end_date: string;
};

const UserSubscriptions = () => {
  const { user } = useUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-8 w-8 text-fdgym-red animate-spin" />
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="glassmorphism border-fdgym-dark-gray">
        <CardHeader>
          <CardTitle className="text-xl font-orbitron">Your Subscriptions</CardTitle>
          <CardDescription className="text-fdgym-light-gray">
            You don't have any active subscriptions yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-fdgym-light-gray">
            Visit our subscription plans page to choose a plan that fits your fitness goals.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism border-fdgym-dark-gray">
      <CardHeader>
        <CardTitle className="text-xl font-orbitron">Your Subscriptions</CardTitle>
        <CardDescription className="text-fdgym-light-gray">
          Your active subscriptions at FD GYM
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="mb-6 last:mb-0">
            <div className="glassmorphism border-fdgym-red rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-orbitron text-lg font-bold">{subscription.plan_name}</h3>
                <div className="bg-green-500/20 text-green-500 text-xs font-medium px-2 py-1 rounded-full">
                  Active
                </div>
              </div>
              
              <div className="text-3xl font-bold mb-4">
                ₹{subscription.amount}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-fdgym-light-gray">Duration:</span>
                  <span>{subscription.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-fdgym-light-gray">Start Date:</span>
                  <span>{format(new Date(subscription.start_date), 'PPP')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-fdgym-light-gray">Expiry Date:</span>
                  <span>{format(new Date(subscription.end_date), 'PPP')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserSubscriptions;
