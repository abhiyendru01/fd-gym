
import { useState } from 'react';
import { Search, Filter, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const workoutCategories = [
  { id: 'all', label: 'All Workouts' },
  { id: 'strength', label: 'Strength' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'hiit', label: 'HIIT' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'abs', label: 'Abs' },
];

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

const mockWorkouts = [
  {
    id: 1,
    title: 'Full Body HIIT',
    category: 'hiit',
    difficulty: 'Intermediate',
    duration: '30 min',
    calories: '350',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1024',
    description: 'High-intensity interval training targeting all major muscle groups for maximum calorie burn.'
  },
  {
    id: 2,
    title: 'Upper Body Strength',
    category: 'strength',
    difficulty: 'Advanced',
    duration: '45 min',
    calories: '280',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1024',
    description: 'Build stronger arms, shoulders, chest and back with this challenging upper body workout.'
  },
  {
    id: 3,
    title: 'Core Crusher',
    category: 'abs',
    difficulty: 'Beginner',
    duration: '20 min',
    calories: '180',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1024',
    description: 'Strengthen your core and sculpt your abs with this focused abdominal workout.'
  },
  {
    id: 4,
    title: 'Cardio Blast',
    category: 'cardio',
    difficulty: 'Intermediate',
    duration: '35 min',
    calories: '400',
    image: 'https://images.unsplash.com/photo-1539794830467-1f1755804d13?auto=format&fit=crop&q=80&w=1024',
    description: 'Elevate your heart rate and burn calories with this high-energy cardio session.'
  },
  {
    id: 5,
    title: 'Yoga Flow',
    category: 'yoga',
    difficulty: 'Beginner',
    duration: '40 min',
    calories: '150',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=1024',
    description: 'Improve flexibility, balance, and mental clarity with this calming yoga sequence.'
  },
  {
    id: 6,
    title: 'Leg Day',
    category: 'strength',
    difficulty: 'Advanced',
    duration: '50 min',
    calories: '320',
    image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&q=80&w=1024',
    description: 'Build lower body strength and power with this intense leg-focused workout.'
  },
  {
    id: 7,
    title: 'HIIT Boxing',
    category: 'hiit',
    difficulty: 'Intermediate',
    duration: '25 min',
    calories: '300',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=1024',
    description: 'Combine boxing techniques with high-intensity intervals for a full body challenge.'
  },
  {
    id: 8,
    title: 'Gentle Morning Yoga',
    category: 'yoga',
    difficulty: 'Beginner',
    duration: '30 min',
    calories: '120',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1024',
    description: 'Start your day with a gentle sequence to awaken your body and calm your mind.'
  }
];

const Workouts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulties.includes(difficulty)) {
      setSelectedDifficulties(selectedDifficulties.filter(d => d !== difficulty));
    } else {
      setSelectedDifficulties([...selectedDifficulties, difficulty]);
    }
  };
  
  const filteredWorkouts = mockWorkouts.filter(workout => {
    // Filter by search query
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
    
    // Filter by difficulty
    const matchesDifficulty = selectedDifficulties.length === 0 || 
                             selectedDifficulties.includes(workout.difficulty);
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-orbitron font-bold mb-4">Workout Library</h1>
            <p className="text-fdgym-light-gray max-w-2xl mx-auto">
              Explore our collection of premium workouts designed by expert trainers to help you achieve your fitness goals.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-fdgym-light-gray" />
              <Input
                type="text"
                placeholder="Search workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-fdgym-dark-gray text-white border-fdgym-dark-gray focus:border-fdgym-red"
              />
            </div>
            
            <Button 
              variant="outline" 
              className="border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white md:w-auto w-full flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
          
          {showFilters && (
            <div className="glassmorphism rounded-xl p-6 mb-8 md:flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-3">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficultyLevels.map((level) => (
                    <Button
                      key={level}
                      variant="outline"
                      size="sm"
                      className={`${
                        selectedDifficulties.includes(level)
                          ? 'bg-fdgym-red text-white border-fdgym-red'
                          : 'border-fdgym-dark-gray text-fdgym-light-gray hover:border-fdgym-red hover:text-fdgym-red'
                      }`}
                      onClick={() => toggleDifficulty(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <h3 className="font-medium mb-3">Duration</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-fdgym-dark-gray text-fdgym-light-gray hover:border-fdgym-red hover:text-fdgym-red"
                  >
                    Under 30 min
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-fdgym-dark-gray text-fdgym-light-gray hover:border-fdgym-red hover:text-fdgym-red"
                  >
                    30-45 min
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-fdgym-dark-gray text-fdgym-light-gray hover:border-fdgym-red hover:text-fdgym-red"
                  >
                    Over 45 min
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="ghost" 
                  className="text-fdgym-red hover:text-fdgym-neon-red hover:bg-transparent"
                  onClick={() => {
                    setSelectedDifficulties([]);
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <TabsList className="w-full bg-fdgym-dark-gray mb-8 flex overflow-x-auto no-scrollbar">
              {workoutCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex-1 data-[state=active]:bg-fdgym-red whitespace-nowrap"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {workoutCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                {category.id === 'all' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkouts.map((workout) => (
                      <WorkoutCard key={workout.id} workout={workout} />
                    ))}
                  </div>
                )}
                
                {category.id !== 'all' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkouts
                      .filter((workout) => workout.category === category.id)
                      .map((workout) => (
                        <WorkoutCard key={workout.id} workout={workout} />
                      ))}
                  </div>
                )}
                
                {filteredWorkouts.length === 0 && (
                  <div className="text-center py-12">
                    <Dumbbell className="h-12 w-12 text-fdgym-red mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No workouts found</h3>
                    <p className="text-fdgym-light-gray">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

interface WorkoutCardProps {
  workout: {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    duration: string;
    calories: string;
    image: string;
    description: string;
  };
}

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  return (
    <Card className="glassmorphism border-fdgym-dark-gray overflow-hidden group h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={workout.image} 
          alt={workout.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            workout.difficulty === 'Beginner' 
              ? 'bg-green-500/20 text-green-500' 
              : workout.difficulty === 'Intermediate'
                ? 'bg-yellow-500/20 text-yellow-500'
                : 'bg-red-500/20 text-red-500'
          }`}>
            {workout.difficulty}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-orbitron text-lg font-bold text-white">{workout.title}</h3>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-fdgym-light-gray">{workout.duration}</span>
            <span className="text-fdgym-light-gray">•</span>
            <span className="text-fdgym-light-gray">{workout.calories} cal</span>
          </div>
        </div>
      </div>
      <CardContent className="flex-grow flex flex-col p-4">
        <p className="text-fdgym-light-gray text-sm mb-auto">{workout.description}</p>
        <Button 
          className="mt-4 bg-fdgym-dark-gray hover:bg-fdgym-red text-white w-full group-hover:bg-fdgym-red transition-colors"
        >
          View Workout
        </Button>
      </CardContent>
    </Card>
  );
};

export default Workouts;
