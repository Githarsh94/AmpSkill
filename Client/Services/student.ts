import { auth } from '../lib/firebaseConfig';

interface UserProfile {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

interface Tests {
    message: string;
    activeTests: [];
    completedTests: [];
    upcomingTests: [];
    missedTests: [];
}



export const fetchStudentProfile = async (email: string): Promise<UserProfile> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/teacher/dashboard/profile', {
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

export const fetchAllTests = async (email: string): Promise<Tests> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    };
    const response = await fetch('/student/dashboard/getAllTests', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch tests');
    }
    return response.json();

};