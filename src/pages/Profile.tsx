import { useState, useEffect } from 'react';
import { useUser, UserProfile } from '@clerk/clerk-react';
import { CalendarClock, CreditCard, Package, Edit, Upload, Check } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import UserSubscriptions from '@/components/UserSubscriptions';

// Mock subscription data
const mockSubscription = {
  status: 'active',
  plan: '6 Months',
  startDate: '2023-08-15',
  endDate: '2024-02-15',
  price: '₹5000',
  features: [
    'Full gym access',
    'Personal trainer (3 sessions)',
    'Custom diet plans',
    'Monthly body analysis',
    'Priority booking'
  ]
};

const Profile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setName(user.fullName || '');
      setEmail(user.primaryEmailAddress?.emailAddress || '');
    }
  }, [isLoaded, isSignedIn, user]);
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, you would save the profile information to your backend
  };
  
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
                  
                  <h2 className="mt-4 text-2xl font-orbitron font-bold">{user.fullName || 'User'}</h2>
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
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-green-500 font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-fdgym-light-gray text-sm">Current Plan</p>
                    <p>{mockSubscription.plan}</p>
                  </div>
                  
                  <div>
                    <p className="text-fdgym-light-gray text-sm">Expires On</p>
                    <p>{new Date(mockSubscription.endDate).toLocaleDateString()}</p>
                  </div>
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
                
                <TabsContent value="profile" className="mt-6">
                  <Card className="glassmorphism border-fdgym-dark-gray">
                    <CardHeader>
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
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-fdgym-light-gray">Full Name</Label>
                          <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-fdgym-light-gray">Email</Label>
                          <Input 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-fdgym-light-gray">Phone Number</Label>
                          <Input 
                            id="phone" 
                            placeholder="Enter your phone number" 
                            disabled={!isEditing}
                            className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob" className="text-fdgym-light-gray">Date of Birth</Label>
                          <Input 
                            id="dob" 
                            type="date" 
                            disabled={!isEditing}
                            className="bg-fdgym-dark-gray border-fdgym-dark-gray text-white"
                          />
                        </div>
                      </div>
                    </CardContent>
                    {isEditing && (
                      <CardFooter>
                        <Button 
                          onClick={handleSaveProfile}
                          className="bg-fdgym-red hover:bg-fdgym-neon-red text-white ml-auto"
                        >
                          Save Changes
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                  
                  <div className="mt-6">
                    <UserProfile 
                      appearance={{
                        elements: {
                          card: 'glassmorphism border-fdgym-dark-gray',
                          navbar: 'hidden',
                          headerTitle: 'text-white font-orbitron',
                          headerSubtitle: 'text-fdgym-light-gray',
                          profileSectionTitle: 'text-white font-orbitron',
                          profileSectionPrimaryButton: 'bg-fdgym-red hover:bg-fdgym-neon-red text-white',
                          profileSectionSecondaryButton: 'text-fdgym-red hover:text-fdgym-neon-red',
                          formFieldLabel: 'text-fdgym-light-gray',
                          formFieldInput: 'bg-fdgym-dark-gray border-fdgym-dark-gray text-white',
                          formButtonPrimary: 'bg-fdgym-red hover:bg-fdgym-neon-red text-white',
                          formButtonReset: 'text-fdgym-red hover:text-fdgym-neon-red',
                        }
                      }}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="subscription" className="mt-6">
                  <UserSubscriptions />
                  
                  <Card className="glassmorphism border-fdgym-dark-gray mt-6">
                    <CardHeader>
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
                        <div className="divide-y divide-fdgym-dark-gray">
                          <div className="py-3 px-4 text-sm grid grid-cols-12 gap-4">
                            <div className="col-span-3">Aug 15, 2023</div>
                            <div className="col-span-4">6 Months Subscription</div>
                            <div className="col-span-3">₹5000</div>
                            <div className="col-span-2">
                              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                                Paid
                              </span>
                            </div>
                          </div>
                          <div className="py-3 px-4 text-sm grid grid-cols-12 gap-4">
                            <div className="col-span-3">Feb 15, 2023</div>
                            <div className="col-span-4">3 Months Subscription</div>
                            <div className="col-span-3">₹3000</div>
                            <div className="col-span-2">
                              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                                Paid
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <Card className="glassmorphism border-fdgym-dark-gray">
                    <CardHeader>
                      <CardTitle className="text-xl font-orbitron">Account Settings</CardTitle>
                      <CardDescription className="text-fdgym-light-gray">
                        Manage your account preferences and security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
