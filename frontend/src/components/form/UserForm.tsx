import { useState } from 'react';
import type { FormEvent } from 'react';

interface UserFormProps {
  onSubmit: (formData: UserFormData) => Promise<void>;
  submitButtonText: string;
  role?: 'student' | 'teacher';
  loading?: boolean;
  type?: string;
}

export interface UserFormData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface ValidationErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  submitButtonText,
  loading = false,
  type
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

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
    
    try {
      await onSubmit(formData);
      setFormData({ name: '', username: '', email: '', password: '' });
    } catch (err) {
      setErrors({ 
        general: err instanceof Error ? err.message : 'Operation failed' 
      });
    }
  };

  return (
    <form 
      className={`
          flex flex-col gap-6
          max-w-[400px] min-w-[400px]
          h-fit
          text-neutral-600
          rounded-2xl p-10
          bg-white
          ${type === 'add' ? '' : 'shadow-xl'}
        `}
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border-1 border-neutral-400 p-2 rounded-lg"
      />
      {errors.name && (
        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
      )}

      <input 
        type="text"
        placeholder="Username (max 12 characters)"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        className="border-1 border-neutral-400 p-2 rounded-lg"
        maxLength={12}
      />
      {errors.username && (
        <p className="text-red-400 text-sm mt-1">{errors.username}</p>
      )}

      <input 
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border-1 border-neutral-400 p-2 rounded-lg"
      />
      {errors.email && (
        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
      )}

      <input 
        type="password"
        placeholder="Password (5-8 characters)"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="border-1 border-neutral-400 p-2 rounded-lg"
      />
      {errors.password && (
        <p className="text-red-400 text-sm mt-1">{errors.password}</p>
      )}

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      <button 
        type="submit"
        disabled={loading}
        className="rounded-xl text-white text-lg font-medium bg-[#DDA853] px-3 py-2.5 hover:cursor-pointer hover:bg-[#b98e48] transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : submitButtonText}
      </button>
    </form>
  );
};

export default UserForm;
