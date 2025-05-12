import { useState, useEffect } from 'react'

export default function Home() {
    const [count, setCount] = useState(0);
    const [user, setUser] = useState<string | null>("");

    useEffect(() => {
        const fetchApiData = async () => {
        try {
            const response = await fetch('http://localhost/track-learn/php_scripts/user/user.php');
            const data = await response.json();
            console.log(data);
            if (data) {
            setUser(data.users[0].name);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        }

        fetchApiData();
        
    }, [count]);

    return (
        <div>
            <h2>Track & Learn main page</h2>

            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                Click to fetch users from API and show them in console
                </button>
                <p>
                {user} is the first user
                </p>
            </div>
        </div>
    );
}
