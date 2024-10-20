import { auth } from '../lib/firebaseConfig';

interface UserProfile {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

interface updatedDataPayload {
    batchName: string;
    department: string;
    branch: string;
    year: number;
    teacherEmail: string;
    batchUpdates: {
        batchName: string;
        department: string;
        branch: string;
        year: number;
    };
}

export const fetchTeacherProfile = async (email: string): Promise<UserProfile> => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User not authenticated');
    }

    const idToken = await user.getIdToken();

    const response = await fetch(`/teacher/dashboard/profile`, {
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

export const handleUpdateBatch = async (updatedData: updatedDataPayload) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        const idToken = await user.getIdToken();

        const response = await fetch(`/teacher/dashboard/batch/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                batchName: updatedData.batchName,
                department: updatedData.department,
                branch: updatedData.branch,
                year: updatedData.year,
                teacherEmail: updatedData.teacherEmail,
                updates: updatedData.batchUpdates
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error updating batch:', error);
    }
};