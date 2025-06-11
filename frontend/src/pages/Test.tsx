import { useState, useEffect } from 'react';
import { useUserData } from "../context/UserContext";
import type { TestType } from '../types/test-type';
import TestCard from '../components/test/TestCard';
import CreateTestModal from '../components/test/CreateTestModal';
import GenerateTestModal from '../components/test/GenerateTestModal';
import CategoryModal from '../components/test/CategoryModal';
import { LoaderCircle, Plus, Bot } from 'lucide-react';

export default function Test() {
    const { userData } = useUserData();
    const [tests, setTests] = useState<TestType[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTests = async () => {
        try {
            const endpoint = userData?.role === 'admin' 
                ? '/php/test/get_all_tests.php' 
                : '/php/test/teacher_get_tests.php';

            const response = await fetch(endpoint, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to fetch tests');
            
            const data = await response.json();
            setTests(data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleTestDelete = async (testId: string) => {
        try {
            const response = await fetch('/php/test/delete_test.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: testId }),
            });

            if (!response.ok) throw new Error('Failed to delete test');

            setTests(prev => prev.filter(test => test.id.toString() !== testId));
        } catch (error) {
            console.error('Error deleting test:', error);
        }
    };

    if (!userData || (userData.role !== 'teacher' && userData.role !== 'admin')) {
        return (
            <div className="mt-20 max-w-4xl mx-auto bg-orange-200 border border-orange-500 rounded-2xl p-6 text-center">
                <h1 className="text-xl font-medium text-yellow-800 mb-2">Access Restricted</h1>
                <p className="text-yellow-700">
                    You don't have access to this page.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-row flex-wrap gap-6 justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    {userData.role === 'admin' ? 'Test Management' : 'My Tests'}
                </h1>
                {userData.role === 'admin' ? (
                    <button
                        onClick={() => setShowCategoryModal(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        ➕ Manage Categories
                    </button>
                ) : (
                    userData.role === 'teacher' && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowGenerateModal(true)}
                                className="bg-teal-600 text-white font-medium flex flex-row gap-3 py-2 px-3 rounded-lg hover:bg-teal-700 transition-colors hover:cursor-pointer"
                            >
                                <Bot strokeWidth={3} />
                                AI Generate
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-teal-600 text-white font-medium flex flex-row gap-3 py-2 px-3 rounded-lg hover:bg-teal-700 transition-colors hover:cursor-pointer"
                            >
                                <Plus strokeWidth={3} />
                                New Test
                            </button>
                        </div>
                    )
                )}
            </div>

            {userData.role === 'admin' && (
                <CategoryModal
                    isOpen={showCategoryModal}
                    onClose={() => setShowCategoryModal(false)}
                    onSuccess={() => setShowCategoryModal(false)}
                />
            )}

            {userData.role === 'teacher' && (
                <>
                    <CreateTestModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSuccess={() => {
                            fetchTests();
                            setShowCreateModal(false);
                        }}
                    />

                    <GenerateTestModal
                        isOpen={showGenerateModal}
                        onClose={() => setShowGenerateModal(false)}
                        onSuccess={() => {
                            fetchTests();
                            setShowGenerateModal(false);
                        }}
                    />
                </>
            )}

            {isLoading ? (
                <section className="flex h-full justify-center items-center">
                    <div className="text-gray-600 pt-10 flex flex-col items-center gap-4">
                        <LoaderCircle className="animate-spin text-teal-600" size={45} />
                        <span className='text-teal-600 text-lg font-medium'>Loading tests...</span>
                    </div>
                </section>
            ) : tests.length > 0 ? (
                <div className="flex flex-row flex-wrap gap-10">
                    {tests.map((test) => (
                        <TestCard
                            key={test.id}
                            test={test}
                            onDelete={handleTestDelete}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-teal-600 pt-15 text-lg font-medium text-center">No tests available yet.</p>
            )}
        </div>
    );
}
