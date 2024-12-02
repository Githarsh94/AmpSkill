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

interface ScoreCard {
    email: string;
    testCode: string;
    subjectName: string;
    title: string;
    rank: number;
    maximumMarks: number;
    score: number;
    timeTaken: number;
    incorrectAnswers: number;
    correctAnswers: number;
    skippedAnswers: number;
    percentage: number;
    avgTimeTakenPerQue: number;
    totalTime: number;
    totalQuestions: number;
}
interface CompleteScoreCard{
    scoreCard: ScoreCard,
    topperScore: number,
    topperTimeTaken: number,
    totalCandidates: number
}

interface markedAnswer{
    question_no: number;
    answer: string;
}
interface SolutionReport{
    questions: IQuestion[];
    userMarkedAnswers: markedAnswer[];
}
interface QuestionReport{
    userMarkedAnswers: markedAnswer[];
    topperMarkedAnswers: markedAnswer[];
    noOfQuestions: number;
    questions: IQuestion[];
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
    const response = await fetch('/student/test/getAllTests', {
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

    const response = await fetch('/student/test/startTest', {
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
export const submitTest = async (email: string, testCode: string) => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/student/test/submitTest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, testCode }),
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

    const response = await fetch('/student/test/markTheAnswer', {
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

    const response = await fetch('/student/test/getTestDuration', {
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

export const fetchTestScoreCard = async (email: string, testCode: string): Promise<CompleteScoreCard> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/student/report/getTestScoreCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, testCode }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch score card');
    }
    // console.log("I am in scorecard service");
    const data = await response.json();
    // console.log(data);
    return data;
}
export const fetchSolutionReport= async(email: string, testCode: string): Promise<SolutionReport> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/student/report/getSolutionReport', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, testCode }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch solution report');
    }

    const data = await response.json();
    return data;
};
export const fetchQuestionReport = async(email: string, testCode: string): Promise<QuestionReport> => {
    let idToken = localStorage.getItem('sessionId');

    if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
    }

    const response = await fetch('/student/report/getQuestionReport', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, testCode }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch question report');
    }

    const data = await response.json();
    return data;
};