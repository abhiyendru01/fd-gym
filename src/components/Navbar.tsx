
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Dumbbell } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useClerk();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-fdgym-red" />
            <span className="font-orbitron text-xl font-bold text-white">FD <span className="text-fdgym-red">GYM</span></span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors">Home</Link>
            <Link to="/workouts" className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors">Workouts</Link>
            <Link to="/bmi" className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors">BMI Calculator</Link>
            <Link to="/partner-gyms" className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors">Partner Gyms</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="outline" className="border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white">
                    My Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => signOut()}
                  className="text-fdgym-light-gray hover:text-fdgym-neon-red"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" className="border-fdgym-red text-fdgym-red hover:bg-fdgym-red hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-fdgym-red hover:bg-fdgym-neon-red text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-fdgym-dark-gray/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/workouts" 
              className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Workouts
            </Link>
            <Link 
              to="/bmi" 
              className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              BMI Calculator
            </Link>
            <Link 
              to="/partner-gyms" 
              className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Partner Gyms
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors py-2 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-fdgym-light-gray hover:text-fdgym-neon-red transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
