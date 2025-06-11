import { useNavigate } from 'react-router';
import { useUserData } from '../context/UserContext';

export default function Home() {
    const { userData } = useUserData();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 pt-50">
            <h1 className="text-7xl font-bold text-center mb-12">
                Welcome, {userData?.name}!
            </h1>
            <p className='text-4xl font-medium text-center mb-12'>
                What would you like to do today?
            </p>

            <div className="flex flex-wrap justify-center gap-6">
                {userData?.role !== 'student' && (
                    <>
                        <button
                            onClick={() => navigate('/test')}
                            className="
                                px-6 py-3 
                                text-teal-600 border-1 border-teal-600
                                rounded-xl text-lg font-medium
                                hover:bg-teal-600 hover:text-white hover:cursor-pointer
                                transition-colors
                            "
                        >
                            Manage Tests
                        </button>
                        {
                            userData?.role === 'admin' && (
                                <button
                                    onClick={() => navigate('/users')}
                                    className="
                                        px-6 py-3 
                                        text-cyan-600 border-1 border-cyan-600
                                        rounded-xl text-lg font-medium
                                        hover:bg-cyan-600 hover:text-white hover:cursor-pointer
                                        transition-colors
                                    "
                                >
                                    Manage Users
                                </button>
                            )
                        }
                    </>
                )}
                <button
                    onClick={() => navigate('/classroom')}
                    className="
                        px-6 py-3 
                        text-cyan-600 border-1 border-cyan-600
                        rounded-xl text-lg font-medium
                        hover:bg-cyan-600 hover:text-white hover:cursor-pointer
                        transition-colors
                    "
                >
                    {userData?.role === 'student' ? 'Check Classrooms' : 'Manage Classrooms'}
                </button>
            </div>
        </div>
    );
}
