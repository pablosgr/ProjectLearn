import { useState, useEffect } from 'react';
import { useUserData } from "../context/UserContext";
import type { TestType } from '../types/test-type';
import TestCard from '../components/test/TestCard';
import CreateTestModal from '../components/test/CreateTestModal';
import GenerateTestModal from '../components/test/GenerateTestModal';

export default function Test() {
    const { userData } = useUserData();
    const [tests, setTests] = useState<TestType[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTests = async () => {
        try {
            const response = await fetch('/php/test/teacher_get_tests.php', {
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

    if (userData?.role !== 'teacher') {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Tests</h1>
                <p className="text-gray-600">You are not authorized to view this page.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Tests</h1>
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
            </div>

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
