import { auth } from '../lib/firebaseConfig';

interface UserProfile {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

export const fetchStudentProfile = async (email: string): Promise<UserProfile> => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User not authenticated');
    }

    const idToken = await user.getIdToken();

    const response = await fetch('http://localhost:3000/api/teacher/dashboard/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch profile');
    }

    return response.json();
};