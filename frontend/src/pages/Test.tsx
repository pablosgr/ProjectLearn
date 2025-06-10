import { useState, useEffect } from 'react';
import { useUserData } from "../context/UserContext";
import type { TestType } from '../types/test-type';
import TestCard from '../components/test/TestCard';
import CreateTestModal from '../components/test/CreateTestModal';
import GenerateTestModal from '../components/test/GenerateTestModal';
import CategoryModal from '../components/test/CategoryModal';

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
            <div className="flex justify-between items-center mb-8">
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
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                            >
                                🤖 AI Generate
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                            >
                                ➕ New Test
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
                <div className="flex justify-center items-center">
                    <p className="text-gray-600">Loading tests...</p>
                </div>
            ) : tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <TestCard
                            key={test.id}
                            test={test}
                            onDelete={handleTestDelete}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center py-12">No tests available yet</p>
            )}
        </div>
    );
}
