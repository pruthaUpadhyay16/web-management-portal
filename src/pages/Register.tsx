import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserCircle   } from "lucide-react";
import { toast} from "react-toastify";



const Register = () => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (auth) await auth.register(formData.name, formData.email, formData.phone, formData.password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-96 bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-gray-200">
        {/* Icon */}
        <div className="flex justify-center">
          <UserCircle   className="w-10 h-10 text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 mt-4">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required 
          />
          <input 
            type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required 
          />
          <input 
            type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required 
          />
          <input 
            type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required 
          />
          <input 
            type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required 
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
  
};

export default Register;
