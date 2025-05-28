import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';

interface ValidationErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (formData.username.length > 12) {
      newErrors.username = 'Username must be 12 characters or less';
    }

    if (formData.password && (formData.password.length < 5 || formData.password.length > 8)) {
      newErrors.password = 'Password must be between 5 and 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/php/user/user_register.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Redirect to login page after successful registration
      navigate('/login');
      
    } catch (err) {
      setErrors({ 
        ...errors, 
        general: err instanceof Error ? err.message : 'Registration failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-neutral-800 text-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Student Registration</h1>
        
        <form 
          className="flex flex-col gap-4 bg-neutral-700 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          onSubmit={handleSubmit}
        >
          <div>
            <input 
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 rounded-lg bg-neutral-600 border border-neutral-500 focus:outline-none focus:border-cyan-500"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input 
              type="text"
              placeholder="Username (max 12 characters)"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-2 rounded-lg bg-neutral-600 border border-neutral-500 focus:outline-none focus:border-cyan-500"
              maxLength={12}
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input 
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 rounded-lg bg-neutral-600 border border-neutral-500 focus:outline-none focus:border-cyan-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input 
              type="password"
              placeholder="Password (5-8 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 rounded-lg bg-neutral-600 border border-neutral-500 focus:outline-none focus:border-cyan-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="mt-2 rounded-3xl bg-cyan-600 px-4 py-2 font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </main>
  );
}
