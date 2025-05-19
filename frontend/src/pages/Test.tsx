import { useUserData } from "../context/UserContext";

export default function Test() {
    const { userData, isLogged } = useUserData();

    if (!isLogged) {
        return (
            <div>
                <h1>Tests</h1>
                <p>Please authenticate, redirecting to login..</p>
            </div>
        );
    }

    if (userData?.role !== 'teacher') {
        return (
            <div>
                <h1>Tests</h1>
                <p>You are not authorized to view this page.</p>
            </div>
        );
    }

    return (
        <div>
        <h1>Tests</h1>
        <p>This is the tests page. You have to be a teacher to be here.</p>
        </div>
    )
}
