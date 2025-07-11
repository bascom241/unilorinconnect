import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CSSTransition } from 'react-transition-group';
import { authStore } from '../store/useAuthStore';

const Signup = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    matricNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { register } = authStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword, matricNumber } = userData;

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!email.endsWith('@students.unilorin.edu.ng')) {
      toast.error('Please use your university email address');
      return;
    }

    setLoading(true);

    try {
      const success = await register({ fullName, email, password, confirmPassword, matricNumber });
      if (success) {
        navigate("/verify-email");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <CSSTransition
        in={!showLogin}
        timeout={500}
        classNames="form-transition"
        unmountOnExit
      >
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <span className="font-bold text-2xl text-uniblue-500">UnilorinConnect</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to join the UnilorinConnect platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={userData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@students.unilorin.edu.ng"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricNumber">Matric Number (Optional)</Label>
                <Input
                  id="matricNumber"
                  name="matricNumber"
                  placeholder="19/56AB123"
                  value={userData.matricNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-uniblue-500 hover:bg-uniblue-600" 
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 text-uniblue-500 hover:text-uniblue-600"
                onClick={handleShowLogin}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Sign in
              </Button>
            </div>
          </CardFooter>
        </Card>
      </CSSTransition>
    </div>
  );
};

export default Signup;
