interface UserProfile {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

export const fetchAdminProfile = async (email: string): Promise<UserProfile> => {
    const response = await fetch('http://localhost:3000/api/admin/dashboard/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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