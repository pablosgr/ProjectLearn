export default async function validateSession(): Promise<boolean> {
    let isSessionValid = true;
    try {
        const response = await fetch('/php/auth/validate_session.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        if(!response.ok) {
            throw new Error('Network response failed');
        }
        
        const data = await response.json();
        if(data['error']){
            console.error('Session validation error:', data['error']);
            isSessionValid = false;
        }
    } catch (error) {
        console.error('Error in API fetch:', error);
        isSessionValid = false;
    }

    return isSessionValid;
}
