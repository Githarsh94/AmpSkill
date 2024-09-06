import React, { useState } from 'react';
import styles from '../styles/test.module.css';
type TestDetails = {
  title: string;
  description: string;
  startTime: string;
  loginWindow: string;
  isFullScreenEnforced: boolean;
  isTabSwitchPreventionEnabled: boolean;
  isCameraAccessRequired: boolean;
  questionsFile: File | null;
};

const TestCreation: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [testDetails, setTestDetails] = useState<TestDetails>({
    title: '',
    description: '',
    startTime: '',
    loginWindow: '',
    isFullScreenEnforced: false,
    isTabSwitchPreventionEnabled: false,
    isCameraAccessRequired: false,
    questionsFile: null,
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTestDetails({ ...testDetails, questionsFile: e.target.files[0] });
    }
  };

  const handleSaveTest = () => {
    // Logic to save test
    console.log(testDetails);
  };

  return (
    <div className={styles.testCreationContainer}>
      {step === 1 && (
        <div>
          <h2 className={styles.testHeading}>Step 1: Test Information</h2>
          <input
            type="text"
            className={styles.testInputText}
            placeholder="Test Title"
            value={testDetails.title}
            onChange={(e) => setTestDetails({ ...testDetails, title: e.target.value })}
          />
          <textarea
            className={styles.testTextarea}
            placeholder="Test Description"
            value={testDetails.description}
            onChange={(e) => setTestDetails({ ...testDetails, description: e.target.value })}
          />
          <input
            type="datetime-local"
            className={styles.testInputDatetime}
            value={testDetails.startTime}
            onChange={(e) => setTestDetails({ ...testDetails, startTime: e.target.value })}
          />
          <input
            type="number"
            className={styles.testInputNumber}
            placeholder="Login Window (minutes)"
            value={testDetails.loginWindow}
            onChange={(e) => setTestDetails({ ...testDetails, loginWindow: e.target.value })}
          />
          <button className={styles.testButton} onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className={styles.testHeading}>Step 2: Test Settings</h2>
          <label className={styles.testLabel}>
            <input
              type="checkbox"
              className={styles.testCheckbox}
              checked={testDetails.isFullScreenEnforced}
              onChange={(e) => setTestDetails({ ...testDetails, isFullScreenEnforced: e.target.checked })}
            />
            Full Screen Enforced
          </label>
          <label className={styles.testLabel}>
            <input
              type="checkbox"
              className={styles.testCheckbox}
              checked={testDetails.isTabSwitchPreventionEnabled}
              onChange={(e) =>
                setTestDetails({ ...testDetails, isTabSwitchPreventionEnabled: e.target.checked })
              }
            />
            Tab Switch Prevention Enabled
          </label>
          <label className={styles.testLabel}>
            <input
              type="checkbox"
              className={styles.testCheckbox}
              checked={testDetails.isCameraAccessRequired}
              onChange={(e) =>
                setTestDetails({ ...testDetails, isCameraAccessRequired: e.target.checked })
              }
            />
            Camera Access Required
          </label>
          <button className={styles.testButton} onClick={handlePrevious}>Back</button>
          <button className={styles.testButton} onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className={styles.testHeading}>Step 3: Add Questions</h2>
          <input type="file" className="testFileInput" accept=".csv, .xlsx" onChange={handleFileUpload} />
          <button className={styles.testButton} onClick={handlePrevious}>Back</button>
          <button className={styles.testButton} onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 4 && (
        <div className={styles.reviewSection}>
          <h2 className={styles.testHeading}>Step 4: Review and Assign</h2>
          <p>Title: <span className={styles.reviewHighlight}>{testDetails.title}</span></p>
          <p>Description: <span className={styles.reviewHighlight}>{testDetails.description}</span></p>
          <p>Start Time: <span className={styles.reviewHighlight}>{testDetails.startTime}</span></p>
          <p>Login Window: <span className={styles.reviewHighlight}>{testDetails.loginWindow}</span></p>
          <p>Full Screen: <span  className={styles.reviewHighlight}>{testDetails.isFullScreenEnforced ? 'Yes' : 'No'}</span></p>
          <p>Tab Switch Prevention: <span  className={styles.reviewHighlight}>{testDetails.isTabSwitchPreventionEnabled ? 'Yes' : 'No'}</span></p>
          <p>Camera Access: <span  className={styles.reviewHighlight}>{testDetails.isCameraAccessRequired ? 'Yes' : 'No'}</span></p>
          <p>Questions File: <span  className={styles.reviewHighlight}>{testDetails.questionsFile ? testDetails.questionsFile.name : 'No file uploaded'}</span></p>
          <button className={styles.testButton} onClick={handlePrevious}>Back</button>
          <button className={styles.testButton} onClick={handleSaveTest}>Save Test</button>
        </div>
      )}
    </div>
  );
};

export default TestCreation;