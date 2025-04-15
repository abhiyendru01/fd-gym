
import { useState, useEffect } from 'react';
import { useUser, UserProfile } from '@clerk/clerk-react';
import { CalendarClock, CreditCard, Package, Edit, Upload, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import UserSubscriptions from '@/components/UserSubscriptions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  dob: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  fitnessGoals: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      height: "",
      weight: "",
      fitnessGoals: "",
    },
  });
  
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      form.reset({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.phoneNumbers?.[0]?.phoneNumber || "",
        dob: "",
        height: "",
        weight: "",
        fitnessGoals: "",
      });
      
      checkUserSubscription();
    }
  }, [isLoaded, isSignedIn, user, form]);
  
  const checkUserSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking subscription:', error);
      }
      
      setHasSubscription(!!data);
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setIsCheckingSubscription(false);
    }
  };
  
  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  }
  
  if (!isLoaded || !isSignedIn) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-fdgym-light-gray">Loading your profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // We're removing the subscription check block that prevented access
  // Now users can access their profile without a subscription

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/3">
              <div className="glassmorphism rounded-xl p-6 sticky top-24">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-32 h-32 border-2 border-fdgym-red">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                    <AvatarFallback className="bg-fdgym-dark-gray text-white text-2xl">
                      {user.fullName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="mt-4 text-2xl font-orbitron font-bold bg-gradient-to-r from-fdgym-red to-fdgym-neon-red bg-clip-text text-transparent">
                    {user.fullName || 'User'}
                  </h2>
                  <p className="text-fdgym-light-gray">{user.primaryEmailAddress?.emailAddress}</p>
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline" className="border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-6 bg-fdgym-dark-gray" />
                
                <div className="space-y-4">
                  <div>
                    <p className="text-fdgym-light-gray text-sm">Member Since</p>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-fdgym-light-gray text-sm">Subscription Status</p>
                    <div className="flex items-center">
                      {hasSubscription ? (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          <span className="text-green-500 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                          <span className="text-yellow-500 font-medium">Free Access</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full bg-fdgym-dark-gray hover:bg-fdgym-red text-white"
                      onClick={() => navigate('/workouts')}
                    >
                      View Workouts
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <Button 
                      className="w-full bg-fdgym-dark-gray hover:bg-fdgym-red text-white"
                      onClick={() => navigate('/bmi')}
                    >
                      Calculate BMI
                    </Button>
                  </div>
                  
                  {!hasSubscription && (
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-fdgym-red to-fdgym-neon-red hover:from-fdgym-neon-red hover:to-fdgym-red text-white font-medium"
                        onClick={() => navigate('/subscriptions')}
                      >
                        Upgrade to Premium
                      </Button>
                      <p className="text-xs text-fdgym-light-gray mt-2">Get exclusive benefits with a premium subscription</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:w-2/3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full bg-fdgym-dark-gray">
                  <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-fdgym-red">Profile</TabsTrigger>
                  <TabsTrigger value="subscription" className="flex-1 data-[state=active]:bg-fdgym-red">Subscription</TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-fdgym-red">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6 space-y-6">
                  <Card className="glassmorphism border-fdgym-dark-gray overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-fdgym-dark-gray to-fdgym-black">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-xl font-orbitron">Personal Information</CardTitle>
                          <CardDescription className="text-fdgym-light-gray">
                            Update your personal details and preferences
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="text-fdgym-red hover:text-fdgym-neon-red hover:bg-transparent"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? (
                            <Check className="h-5 w-5 mr-2" />
                          ) : (
                            <Edit className="h-5 w-5 mr-2" />
                          )}
                          {isEditing ? 'Save' : 'Edit'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-fdgym-light-gray">Full Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      disabled={!isEditing}
                                      className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-fdgym-light-gray">Email</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      disabled={!isEditing}
                                      className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-fdgym-light-gray">Phone Number</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      disabled={!isEditing}
                                      className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="dob"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-fdgym-light-gray">Date of Birth</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      type="date"
                                      disabled={!isEditing}
                                      className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="height"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-fdgym-light-gray">Height (cm)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      type="number"
                                      disabled={!isEditing}
                                      className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="weight"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-fdgym-light-gray">Weight (kg)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      type="number"
                                      disabled={!isEditing}
                                      className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="fitnessGoals"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-fdgym-light-gray">Fitness Goals</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    disabled={!isEditing}
                                    className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white min-h-[100px]"
                                    placeholder="Describe your fitness goals and aspirations..."
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {isEditing && (
                            <div className="flex justify-end">
                              <Button 
                                type="submit"
                                className="bg-fdgym-red hover:bg-fdgym-neon-red text-white"
                              >
                                Save Changes
                              </Button>
                            </div>
                          )}
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="subscription" className="mt-6">
                  <UserSubscriptions />
                  
                  <Card className="glassmorphism border-fdgym-dark-gray mt-6">
                    <CardHeader className="bg-gradient-to-r from-fdgym-dark-gray to-fdgym-black">
                      <CardTitle className="text-xl font-orbitron">Payment History</CardTitle>
                      <CardDescription className="text-fdgym-light-gray">
                        View your recent transactions and billing history
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border border-fdgym-dark-gray overflow-hidden">
                        <div className="bg-fdgym-dark-gray py-3 px-4 text-sm font-medium grid grid-cols-12 gap-4">
                          <div className="col-span-3">Date</div>
                          <div className="col-span-4">Description</div>
                          <div className="col-span-3">Amount</div>
                          <div className="col-span-2">Status</div>
                        </div>
                        {hasSubscription ? (
                          <div className="divide-y divide-fdgym-dark-gray">
                            <div className="py-3 px-4 text-sm grid grid-cols-12 gap-4">
                              <div className="col-span-3">Just Now</div>
                              <div className="col-span-4">Premium Plan Subscription</div>
                              <div className="col-span-3">₹4999</div>
                              <div className="col-span-2">
                                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                                  Paid
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-6 text-center text-fdgym-light-gray">
                            <p>No payment history available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <Card className="glassmorphism border-fdgym-dark-gray overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-fdgym-dark-gray to-fdgym-black">
                      <CardTitle className="text-xl font-orbitron">Account Settings</CardTitle>
                      <CardDescription className="text-fdgym-light-gray">
                        Manage your account preferences and security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Email Notifications</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="marketing-emails" className="text-fdgym-light-gray">
                              Marketing emails
                            </Label>
                            <input
                              type="checkbox"
                              id="marketing-emails"
                              className="form-checkbox h-5 w-5 text-fdgym-red rounded border-fdgym-dark-gray bg-fdgym-dark-gray focus:ring-fdgym-red"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="product-updates" className="text-fdgym-light-gray">
                              Product updates
                            </Label>
                            <input
                              type="checkbox"
                              id="product-updates"
                              className="form-checkbox h-5 w-5 text-fdgym-red rounded border-fdgym-dark-gray bg-fdgym-dark-gray focus:ring-fdgym-red"
                              defaultChecked
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="account-alerts" className="text-fdgym-light-gray">
                              Account alerts
                            </Label>
                            <input
                              type="checkbox"
                              id="account-alerts"
                              className="form-checkbox h-5 w-5 text-fdgym-red rounded border-fdgym-dark-gray bg-fdgym-dark-gray focus:ring-fdgym-red"
                              defaultChecked
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="bg-fdgym-dark-gray" />
                      
                      <div>
                        <h3 className="font-medium mb-4">Account Actions</h3>
                        <div className="space-y-3">
                          <Button variant="outline" className="border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white w-full justify-start">
                            Change Password
                          </Button>
                          <Button variant="outline" className="border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white w-full justify-start">
                            Enable Two-Factor Authentication
                          </Button>
                          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white w-full justify-start">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
