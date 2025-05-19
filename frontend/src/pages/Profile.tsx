import { useUserData } from '../context/UserContext.tsx';

export default function Profile() {
    const { userData } = useUserData();

    return (
        <div>
            <h2>Profile</h2>
            <p className="text-cyan-500">This is the profile page for {userData?.name}</p>
        </div>
    );
}
