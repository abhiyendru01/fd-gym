
import { useState } from 'react';
import { Users, Dumbbell, MapPin, Settings, LogOut, Search } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    plan: '6 Months',
    status: 'active',
    expiryDate: '2024-02-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    plan: '12 Months',
    status: 'active',
    expiryDate: '2024-08-10',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    plan: '3 Months',
    status: 'expired',
    expiryDate: '2023-11-05',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    plan: '1 Month',
    status: 'active',
    expiryDate: '2023-12-20',
  },
];

// Mock data for workouts
const mockWorkouts = [
  {
    id: 1,
    name: 'Full Body HIIT',
    category: 'Cardio',
    difficulty: 'Intermediate',
    duration: '30 min',
  },
  {
    id: 2,
    name: 'Upper Body Strength',
    category: 'Strength',
    difficulty: 'Advanced',
    duration: '45 min',
  },
  {
    id: 3,
    name: 'Core Crusher',
    category: 'Abs',
    difficulty: 'Beginner',
    duration: '20 min',
  },
  {
    id: 4,
    name: 'Leg Day',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: '40 min',
  },
];

// Mock data for partner gyms
const mockGyms = [
  {
    id: 1,
    name: 'FD Fitness Elite',
    location: 'Delhi',
    address: '123 Main Street, Delhi',
    status: 'active',
  },
  {
    id: 2,
    name: 'FD GYM Premium',
    location: 'Mumbai',
    address: '456 Park Avenue, Mumbai',
    status: 'active',
  },
  {
    id: 3,
    name: 'FD Powerhouse',
    location: 'Bangalore',
    address: '789 Gym Lane, Bangalore',
    status: 'active',
  },
];

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    signOut();
    navigate('/');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            <div className="glassmorphism rounded-xl p-6 sticky top-24">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-orbitron text-xl font-bold">Admin Panel</h2>
                </div>
                
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-fdgym-dark-gray">
                  <Users className="h-5 w-5 mr-2" />
                  Users
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-fdgym-dark-gray">
                  <Dumbbell className="h-5 w-5 mr-2" />
                  Workouts
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-fdgym-dark-gray">
                  <MapPin className="h-5 w-5 mr-2" />
                  Partner Gyms
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-fdgym-dark-gray">
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-fdgym-red hover:text-fdgym-neon-red hover:bg-fdgym-dark-gray mt-6"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-4/5">
            <Card className="glassmorphism border-fdgym-dark-gray mb-6">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl font-orbitron">Admin Dashboard</CardTitle>
                    <CardDescription className="text-fdgym-light-gray">
                      Manage users, workouts, and partner gyms
                    </CardDescription>
                  </div>
                  
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fdgym-light-gray" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-fdgym-dark-gray text-white border-fdgym-dark-gray pl-10 pr-4 w-full md:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glassmorphism rounded-lg p-4 border-fdgym-dark-gray">
                    <h3 className="text-fdgym-light-gray text-sm font-medium mb-2">Total Users</h3>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold">128</div>
                      <div className="text-green-500 text-sm flex items-center">
                        +12% <span className="ml-1">↑</span>
                      </div>
                    </div>
                  </div>
                  <div className="glassmorphism rounded-lg p-4 border-fdgym-dark-gray">
                    <h3 className="text-fdgym-light-gray text-sm font-medium mb-2">Active Subscriptions</h3>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold">86</div>
                      <div className="text-green-500 text-sm flex items-center">
                        +8% <span className="ml-1">↑</span>
                      </div>
                    </div>
                  </div>
                  <div className="glassmorphism rounded-lg p-4 border-fdgym-dark-gray">
                    <h3 className="text-fdgym-light-gray text-sm font-medium mb-2">Partner Gyms</h3>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold">24</div>
                      <div className="text-green-500 text-sm flex items-center">
                        +4% <span className="ml-1">↑</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="w-full bg-fdgym-dark-gray mb-6">
                <TabsTrigger value="users" className="flex-1 data-[state=active]:bg-fdgym-red">Users</TabsTrigger>
                <TabsTrigger value="workouts" className="flex-1 data-[state=active]:bg-fdgym-red">Workouts</TabsTrigger>
                <TabsTrigger value="gyms" className="flex-1 data-[state=active]:bg-fdgym-red">Partner Gyms</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-orbitron font-bold">User Management</h3>
                  <Button className="bg-fdgym-red hover:bg-fdgym-neon-red text-white">
                    Add New User
                  </Button>
                </div>
                
                <div className="rounded-md border border-fdgym-dark-gray overflow-hidden">
                  <div className="bg-fdgym-dark-gray py-3 px-4 text-sm font-medium grid grid-cols-12 gap-4">
                    <div className="col-span-4">User</div>
                    <div className="col-span-2">Plan</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Expiry Date</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y divide-fdgym-dark-gray">
                    {mockUsers.map((user) => (
                      <div key={user.id} className="py-3 px-4 text-sm grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4 flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-fdgym-dark-gray">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-fdgym-light-gray text-xs">{user.email}</div>
                          </div>
                        </div>
                        <div className="col-span-2">{user.plan}</div>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        <div className="col-span-2">{user.expiryDate}</div>
                        <div className="col-span-2 flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-fdgym-light-gray hover:text-white hover:bg-fdgym-dark-gray">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="workouts" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-orbitron font-bold">Workout Management</h3>
                  <Button className="bg-fdgym-red hover:bg-fdgym-neon-red text-white">
                    Add New Workout
                  </Button>
                </div>
                
                <div className="rounded-md border border-fdgym-dark-gray overflow-hidden">
                  <div className="bg-fdgym-dark-gray py-3 px-4 text-sm font-medium grid grid-cols-12 gap-4">
                    <div className="col-span-4">Workout Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Difficulty</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y divide-fdgym-dark-gray">
                    {mockWorkouts.map((workout) => (
                      <div key={workout.id} className="py-3 px-4 text-sm grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <div className="font-medium">{workout.name}</div>
                        </div>
                        <div className="col-span-2">{workout.category}</div>
                        <div className="col-span-2">{workout.difficulty}</div>
                        <div className="col-span-2">{workout.duration}</div>
                        <div className="col-span-2 flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-fdgym-light-gray hover:text-white hover:bg-fdgym-dark-gray">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gyms" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-orbitron font-bold">Partner Gym Management</h3>
                  <Button className="bg-fdgym-red hover:bg-fdgym-neon-red text-white">
                    Add New Gym
                  </Button>
                </div>
                
                <div className="rounded-md border border-fdgym-dark-gray overflow-hidden">
                  <div className="bg-fdgym-dark-gray py-3 px-4 text-sm font-medium grid grid-cols-12 gap-4">
                    <div className="col-span-3">Gym Name</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-4">Address</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y divide-fdgym-dark-gray">
                    {mockGyms.map((gym) => (
                      <div key={gym.id} className="py-3 px-4 text-sm grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <div className="font-medium">{gym.name}</div>
                        </div>
                        <div className="col-span-2">{gym.location}</div>
                        <div className="col-span-4">{gym.address}</div>
                        <div className="col-span-1">
                          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                            Active
                          </span>
                        </div>
                        <div className="col-span-2 flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-fdgym-light-gray hover:text-white hover:bg-fdgym-dark-gray">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
