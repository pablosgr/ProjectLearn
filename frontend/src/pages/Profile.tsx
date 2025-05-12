export default function Profile({ name }: { name: string }) {
    return (
        <div>
            <h2>Profile</h2>
            <p>This is the profile page for {name}</p>
        </div>
    );
}
