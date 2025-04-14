
import { useState, useEffect } from 'react';
import { ArrowRight, Dumbbell, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background and parallax effect */}
      <div 
        className="absolute inset-0 bg-gradient-gym"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=1920')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.3)',
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      
      {/* Animated neon line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-fdgym-neon-red blur-sm opacity-50 transform -translate-y-1/2" />
      
      {/* Content */}
      <div className="container mx-auto px-4 pt-20 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="lg:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-black text-white leading-tight">
              TRANSFORM YOUR <span className="text-fdgym-neon-red">BODY</span>
              <br />
              ELEVATE YOUR <span className="text-fdgym-neon-red">LIFE</span>
            </h1>
            
            <p className="text-lg md:text-xl text-fdgym-light-gray max-w-2xl">
              FD GYM offers premium fitness experiences with cutting-edge equipment, expert trainers, and personalized programs to help you achieve your fitness goals.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <LoginButton variant="admin" />
              <LoginButton variant="user" />
            </div>
            
            <div className="flex flex-wrap gap-6 pt-6">
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-6 w-6 text-fdgym-red" />
                <span className="text-white">Premium Equipment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-fdgym-red" />
                <span className="text-white">24/7 Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-fdgym-red" />
                <span className="text-white">Expert Trainers</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-square rounded-full bg-fdgym-red/20 blur-3xl absolute inset-0" />
              <img 
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800"
                alt="Fitness trainer"
                className="rounded-2xl shadow-2xl relative z-10 animate-float object-cover"
              />
              {/* Neon border effect */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-fdgym-red to-fdgym-neon-red opacity-70 blur-sm animate-pulse-glow -z-10" />
            </div>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="h-6 w-6 text-fdgym-neon-red transform rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
