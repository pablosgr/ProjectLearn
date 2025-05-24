import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useUserData } from '../context/UserContext';
import Button from '../components/ui/Button';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileField from '../components/profile/ProfileField';
import EditableField from '../components/profile/EditableField';

export default function Profile() {
  const { userData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    username: userData?.username || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(r => setTimeout(r, 1000));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-neutral-200">User Profile</h1>
      
      <ProfileCard>
        <ProfileHeader name={userData?.name} role={userData?.role} />

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <EditableField 
                id="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
              />
              
              <EditableField 
                id="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <Button 
                variant="cancel" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <ProfileField label="Name" value={userData?.name} />
            <ProfileField label="Username" value={userData?.username} />
            <ProfileField label="Email" value={userData?.email} />
            
            <div className="pt-6 flex justify-end">
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </ProfileCard>
    </>
  );
}
