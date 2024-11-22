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

// Interface for the question structure
interface IQuestion {
    s_no: number;
    question: string;
    op1: string;
    op2: string;
    op3: string;
    op4: string;
    ans: string;
}

interface ITest {
    title: string;
    questions: IQuestion[];
    testDuration: number;
    isFullScreenEnforced: boolean;
    isTabSwitchPreventionEnabled: boolean;
    isCameraAccessRequired: boolean;
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

    const response = await fetch('/student/dashboard/profile', {
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

//retrieve the test when test just started
export const fetchTest = async (email: string, testCode: string): Promise<ITest> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/student/dashboard/startTest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, testCode }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch test');
    }

    const data = await response.json();
    return data.test;
}
//submit the test
export const submitTest = async (studentEmail: string, testCode: string) => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/student/dashboard/submitTest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ studentEmail, testCode }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit test');
    }

    return response.json();
}
//mark the answer of the test and save it to db
export const markTheAnswer = async (email: string, testCode: string, question_no: number, answer: string) => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/student/dashboard/markTheAnswer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, testCode, question_no: question_no + 1, answer }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to mark the answer');
    }

    return response.json();
}
//get the test duration
export const getTestDuration = async (email: string, testCode: string) => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/student/dashboard/getTestDuration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, testCode }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch test duration');
    }

    return response.json();
}