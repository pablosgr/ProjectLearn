export default async function getUserData() {
  try {
    const response = await fetch('/php/user/user_get_data.php', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
