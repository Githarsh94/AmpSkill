interface UserProfile {
    name: string;
    email: string;
    role: string;
    createdAt: string;
    picture: string;
}

export const fetchTeacherProfile = async (email: string): Promise<UserProfile> => {
    const response = await fetch('http://localhost:3000/api/teacher/dashboard/profile', {
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