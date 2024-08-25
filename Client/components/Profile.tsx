import { useProfile } from '../context/ProfileContext';
import styles from '../styles/dashboard.module.css';

export default function Profile() {
    const { user } = useProfile();

    return (
        <div className={styles.profileContent}>
            <div>
                <h2>Profile</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Created At:</strong> {user.createdAt}</p>
            </div>
            <div>
                <img src={user.picture} alt="Profile" className={styles.profileImage} />
            </div>
        </div>
    );
}