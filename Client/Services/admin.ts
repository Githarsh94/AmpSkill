// Objective: To provide services for admin dashboard.

import { auth } from '../lib/firebaseConfig';

interface UserProfile {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}
interface UserDetails {
    no_of_batches: number;
    no_of_teachers: number;
    no_of_students: number;
}

interface profileRequirements {
    user: UserProfile;
    userDetails: UserDetails;
}
interface AddBatchPayload {
    batchName: string;
    department: string;
    branch: string;
    year: number;
    students: string[];
    teachers: { teacher: string, subject: string }[];
}

export interface IAssignTeachersPayload {
    batchName: string;
    department: string;
    branch: string;
    year: number;
    teachers: { teacher: string; subject: string }[];
}


export const fetchAdminProfile = async (email: string): Promise<profileRequirements> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/admin/dashboard/profile', {
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

export const assignTeachers = async (payload: IAssignTeachersPayload): Promise<void> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }
    const response = await fetch('/admin/dashboard/assignTeachers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to assign teacher');
    }
};

export const unassignTeachers = async (payload: IAssignTeachersPayload): Promise<void> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }
    const response = await fetch('/admin/dashboard/unassignTeachers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to unassign teacher');
    }
};

export const fetchBatches = async () => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }
    const response = await fetch('/admin/dashboard/getBatches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({}),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to add batch');
    }

    return data;
};

export const deleteBatch = async (batchName: string, department: string, branch: string, year: number) => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }
    const response = await fetch('/admin/dashboard/deleteBatch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ batchName, department, branch, year }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete batch');
    }

    return data;
}

export const addBatch = async (batchData: AddBatchPayload) => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }
    if (batchData.teachers.some(teacher => !teacher.teacher || !teacher.subject)) {
        throw new Error('Number of teachers and Students must be equal');
    }
    const response = await fetch('/admin/dashboard/addBatch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(batchData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to add batch');
    }

    return data;
};

export const getAllTeachers = async () => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }
    const response = await fetch('/admin/dashboard/getAllTeachers', {
        headers: {
            'Authorization': `Bearer ${idToken}`,
        },
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch teachers');
    }

    return data;
}
//create a function to edit the profile ...specifically the name of the user
export const editProfile = async (email: string, name: string) => {
    let idToken = localStorage.getItem('sessionId');
    if (!idToken) {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }
        idToken = await user.getIdToken();
    }
    const response = await fetch('/admin/dashboard/editUsername', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ email, name })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to Edit the profile');
    }

    return data;
}