import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IQuestion {
    s_no: number;
    question: string;
    op1: string;
    op2: string;
    op3: string;
    op4: string;
    ans: string;
}
interface IBatch {
    batchName: string;
    department: string;
    branch: string;
    year: string;
}
interface Test {
    title: string;
    description: string;
    questions: IQuestion[]; // Array of questions
    batches: IBatch[]; // Array of batch objects
    testCode: string;
    password: string;
    startTime: Date; // Start time of the test
    loginWindow: number; // Login window duration in minutes
    testDuration: number; // Test duration in minutes
    isFullScreenEnforced: boolean;
    isTabSwitchPreventionEnabled: boolean;
    isCameraAccessRequired: boolean;
    subjectName: string;
}
interface ArrayContent {
    test: Test;
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    totalQuestions: number;
}
interface TestStore {
    activeTests: ArrayContent[];
    upcomingTests: ArrayContent[];
    completedTests: ArrayContent[];
    missedTests: ArrayContent[];
    setActiveTests: (test: ArrayContent[]) => void;
    setCompletedTests: (test: ArrayContent[]) => void;
    setUpcomingTests: (test: ArrayContent[]) => void;
    setMissedTests: (test: ArrayContent[]) => void;
}
export const useTestStore = create<TestStore>()(
    persist(
        (set) => ({
            activeTests: [],
            upcomingTests: [],
            completedTests: [],
            missedTests: [],
            setActiveTests: (tests: ArrayContent[]) => set((state) => ({
                activeTests: tests,
            })),
            setCompletedTests: (tests: ArrayContent[]) => set((state) => ({
                completedTests: tests,
            })),
            setUpcomingTests: (tests: ArrayContent[]) => set((state) => ({
                upcomingTests: tests,
            })),
            setMissedTests: (tests: ArrayContent[]) => set((state) => ({
                missedTests: tests
            })),
        }),
        {
            name: 'test-store',
            partialize: (state) => ({
                activeTests: state.activeTests,
                completedTests: state.completedTests,
                upcomingTests: state.upcomingTests,
                missedTests: state.missedTests
            }),
        }
    )
)