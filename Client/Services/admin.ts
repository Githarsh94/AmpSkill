
import { auth } from '../lib/firebaseConfig';

interface UserProfile {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

interface AddBatchPayload {
    batchName: string;
    department: string;
    branch: string;
    year: number;
    students: string[];
    teachers: { teacher: string, subject: string }[];
}

export const fetchAdminProfile = async (email: string): Promise<UserProfile> => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User not authenticated');
    }

    const idToken = await user.getIdToken();

    const response = await fetch('http://localhost:3000/api/admin/dashboard/profile', {
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

export const assignTeacher = async (payload: any): Promise<void> => {
    const response = await fetch('http://localhost:3000/api/admin/assign-teacher', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to assign teacher');
    }
};

export const addBatch = async (batchData: AddBatchPayload) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User not authenticated');
    }

    const idToken = await user.getIdToken();
    if (batchData.teachers.some(teacher => !teacher.teacher || !teacher.subject)) {
        throw new Error('Number of teachers and Students must be equal');
    }
    const response = await fetch('http://localhost:3000/api/admin/dashboard/addBatch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(batchData),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add batch');
    }

    return response.json();
};