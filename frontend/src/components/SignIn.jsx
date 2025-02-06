import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import bgimg from "../assets/newsletter.png";
import { FcGoogle } from "react-icons/fc";
import toast from 'react-hot-toast';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailInput = (e) => {
    setFormData({ ...formData, email: e.target.value });
    if (formData.rememberMe) {
      const savedEmails = JSON.parse(localStorage.getItem('savedEmails') || '[]');
      if (!savedEmails.includes(e.target.value)) {
        savedEmails.push(e.target.value);
        localStorage.setItem('savedEmails', JSON.stringify(savedEmails));
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const emailDomain = formData.email.split('@')[1];
    if (emailDomain !== 'nitk.edu.in' && emailDomain !== 'gmail.com') {
      setError('Please use your NITK email (@nitk.edu.in) or Gmail account');
      toast.error('Invalid email domain');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success('Successfully logged in!');
      navigate("/upload");
    } catch (err) {
      console.log("Firebase Error Code:", err.code);
      
      switch (err.code) {
        case 'auth/invalid-credential':
          if (emailDomain === 'nitk.edu.in') {
            setError(
              <div>
                NITK account not found. Please{' '}
                <button 
                  onClick={() => navigate('/register')}
                  className="text-indigo-500 hover:text-indigo-600 underline"
                >
                  register here
                </button>
                {' '}with your NITK email
              </div>
            );
          } else {
            setError('Invalid email or password. Please check your credentials.');
          }
          toast.error('Invalid credentials');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          toast.error('Invalid email format');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled. Please contact support.');
          toast.error('Account disabled');
          break;
        case 'auth/user-not-found':
          setError(
            <div>
              No account found with this email.{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-indigo-500 hover:text-indigo-600 underline"
              >
                Register here
              </button>
            </div>
          );
          toast.error('Account not found');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again or reset your password.');
          toast.error('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later or reset your password.');
          toast.error('Too many attempts');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          toast.error('Network error');
          break;
        default:
          setError(`Authentication Error: ${err.message}`);
          toast.error('Sign in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      toast.success('Successfully logged in with Google!');
      navigate("/upload");
    } catch (err) {
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="flex w-full items-center justify-between">
        <div className="w-[583px] h-[607px] mb-20 ml-20 left-12 bottom-5 relative">
          <img 
            src={bgimg} 
            alt="Reading illustration" 
            className="w-full h-full"
          />
        </div>

        <div className="bg-white rounded-[32px] p-8 w-[450px] mb-20 mr-20 right-10 bottom-5 relative shadow-[13px_13px_0_0_#5C5C5C]">
          <div className="text-center mb-8">
            <h2 className="text-black text-xl mb-1 font-bold leading-4">Welcome</h2>
            <h2 className="text-black text-xl mb-1 font-bold">to</h2> 
            <h1 className="text-4xl font-bold font-jockey-one">BRAINSEG</h1>
          </div>

          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                <span className="text-gray-500">✉️</span>
                <input
                  type="email"
                  id="email"
                  list="savedEmails"
                  value={formData.email}
                  onChange={handleEmailInput}
                  placeholder="example@gmail.com"
                  className="bg-transparent w-full outline-none text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                <span className="text-gray-500">🔑</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••••"
                  className="bg-transparent w-full outline-none text-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500"
                >
                  {showPassword ? "🔒" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="remember" className="text-gray-600 text-sm">Remember me</label>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-indigo-500 text-sm hover:text-indigo-600"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 text-white rounded-lg py-3 hover:bg-indigo-600 transition-colors"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="text-center text-gray-500">OR</div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
            >
              <FcGoogle size={20} />
              <span className="text-gray-700">Login with Google</span>
            </button>

            <div className="text-center text-gray-600 text-sm">
              Don't have an account? 
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-500 ml-1 hover:text-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 