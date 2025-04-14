
import { Link } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import MainLayout from '@/layouts/MainLayout';

const Register = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-orbitron font-bold">Join FD GYM</h1>
            <p className="text-fdgym-light-gray mt-2">Create your account to start your fitness journey</p>
          </div>
          
          <div className="glassmorphism rounded-xl p-6 sm:p-8">
            <SignUp 
              routing="path" 
              path="/register" 
              signInUrl="/login"
              afterSignUpUrl="/profile" 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-fdgym-red hover:bg-fdgym-neon-red text-white',
                  formButtonReset: 'text-fdgym-red hover:text-fdgym-neon-red',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-white font-orbitron',
                  headerSubtitle: 'text-fdgym-light-gray',
                  socialButtonsBlockButton: 'border-fdgym-dark-gray text-white hover:bg-fdgym-dark-gray',
                  socialButtonsBlockButtonText: 'text-white',
                  formFieldLabel: 'text-fdgym-light-gray',
                  formFieldInput: 'bg-fdgym-dark-gray border-fdgym-dark-gray text-white',
                  footerActionLink: 'text-fdgym-red hover:text-fdgym-neon-red',
                  identityPreviewText: 'text-white',
                  identityPreviewEditButton: 'text-fdgym-red hover:text-fdgym-neon-red',
                }
              }}
            />
          </div>
          
          <div className="text-center mt-6">
            <p className="text-fdgym-light-gray">
              Already have an account?{' '}
              <Link to="/login" className="text-fdgym-red hover:text-fdgym-neon-red">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
