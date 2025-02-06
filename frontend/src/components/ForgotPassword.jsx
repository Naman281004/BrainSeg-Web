import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import bgimg from "../assets/newsletter.png";
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailDomain = formData.email.split('@')[1];
    if (emailDomain !== 'nitk.edu.in' && emailDomain !== 'gmail.com') {
      setError('Please use your NITK email (@nitk.edu.in) or Gmail account');
      toast.error('Invalid email domain');
      return;
    }

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(formData.email);
      setMessage("Check your inbox for further instructions");
      toast.success("Password reset email sent!");
    } catch (err) {
      console.error("Reset error:", err.code);
      switch (err.code) {
        case 'auth/user-not-found':
          setError("No account found with this email");
          toast.error("Account not found");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address");
          toast.error("Invalid email format");
          break;
        default:
          setError("Failed to reset password");
          toast.error("Password reset failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="flex w-full items-center justify-between">
        <div className="w-[583px] h-[607px] mb-20 ml-20 left-12 bottom-5 relative">
          <img src={bgimg} alt="Reading illustration" className="w-full h-full" />
        </div>

        <div className="bg-white rounded-[32px] p-8 w-[450px] mb-20 mr-20 right-10 bottom-5 relative shadow-[13px_13px_0_0_#5C5C5C]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-jockey-one">Password Reset</h1>
          </div>

          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
          {message && <div className="text-green-500 text-sm text-center mb-4">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                <span className="text-gray-500">✉️</span>
                <input
                  type="email"
                  id="email"
                  list="savedEmails"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleEmailInput}
                  className="bg-transparent w-full outline-none text-gray-700"
                  required
                />
              </div>
              <datalist id="savedEmails">
                {JSON.parse(localStorage.getItem('savedEmails') || '[]').map((email, index) => (
                  <option key={index} value={email} />
                ))}
              </datalist>
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="remember"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-gray-600 text-sm">
                Remember email
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 text-white rounded-lg py-3 hover:bg-indigo-600 transition-colors"
            >
              Reset Password
            </button>

            <div className="text-center text-gray-600 text-sm">
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="text-indigo-500 hover:text-indigo-600"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 