import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import styles from '../styles/test.module.css';
import { auth } from '../lib/firebaseConfig';
type BatchDetails = {
  batchName: string;
  department: string;
  branch: string;
  year: string;
};

type Que = {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
};

type TestDetails = {
  title: string;
  description: string;
  startTime: string;
  loginWindow: string;
  testDuration: string;
  subjectName: string;
  isFullScreenEnforced: boolean;
  isTabSwitchPreventionEnabled: boolean;
  isCameraAccessRequired: boolean;
  questions: Que[];
  batchDetails: BatchDetails[];
};

const TestCreation: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [questionsFile, setQuestionsFile] = useState<File | null>(null);
  const [batchInput, setBatchInput] = useState<BatchDetails>({
    batchName: '',
    department: '',
    branch: '',
    year: '',
  });
  const [error, setError] = useState<string>('');
  const [testDetails, setTestDetails] = useState<TestDetails>({
    title: '',
    description: '',
    startTime: '',
    loginWindow: '',
    testDuration: '',
    subjectName: '',
    isFullScreenEnforced: false,
    isTabSwitchPreventionEnabled: false,
    isCameraAccessRequired: false,
    questions: [],
    batchDetails: [],
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setQuestionsFile(file);

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: Que[] = XLSX.utils.sheet_to_json(worksheet);

      const chunkSize = 100;
      const questionsArray: Que[] = [];

      for (let i = 0; i < jsonData.length; i += chunkSize) {
        const chunk = jsonData.slice(i, i + chunkSize);
        questionsArray.push(...chunk);
      }
      setTestDetails((prevDetails) => ({ ...prevDetails, questions: questionsArray }));
    }
  };
 
  const handleAddBatch = () => {
    if (!batchInput.batchName || !batchInput.department || !batchInput.branch || !batchInput.year) {
      setError('All batch fields must be filled out before adding.');
      return;
    }

    setTestDetails({
      ...testDetails,
      batchDetails: [...testDetails.batchDetails, batchInput],
    });
    setBatchInput({ batchName: '', department: '', branch: '', year: '' });
    setError('');
  };

  const handleSaveTest = async () => {
    const formData = new FormData();
    formData.append('title', testDetails.title);
    formData.append('description', testDetails.description);
    formData.append('startTime', testDetails.startTime);
    formData.append('loginWindow', testDetails.loginWindow);
    formData.append('testDuration', testDetails.testDuration);
    formData.append('subjectName', testDetails.subjectName);
    formData.append('isFullScreenEnforced', String(testDetails.isFullScreenEnforced));
    formData.append('isTabSwitchPreventionEnabled', String(testDetails.isTabSwitchPreventionEnabled));
    formData.append('isCameraAccessRequired', String(testDetails.isCameraAccessRequired));
    formData.append('batches', JSON.stringify(testDetails.batchDetails));
    console.log("testDetails:", testDetails);

    
    try {
      // Uncomment and configure this part in production
      let idToken = localStorage.getItem('sessionId');

      if (!idToken) {
          const user = auth.currentUser;
  
          if (!user) {
              throw new Error('User not authenticated');
          }
  
          idToken = await user.getIdToken();
      }
      const response = await fetch('/teacher/dashboard/test/uploadTest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: testDetails.title,
          description: testDetails.description,
          startTime: testDetails.startTime,
          loginWindow: testDetails.loginWindow,
          testDuration: testDetails.testDuration,
          subjectName: testDetails.subjectName,
          isFullScreenEnforced: testDetails.isFullScreenEnforced,
          isTabSwitchPreventionEnabled: testDetails.isTabSwitchPreventionEnabled,
          isCameraAccessRequired: testDetails.isCameraAccessRequired,
          batches: testDetails.batchDetails,
          questions: testDetails.questions,
        }),
      });
      const data = await response.json();
      console.log("response: ", data.test);
      alert(data.message); 
    } catch (error) {
      console.error('Error saving test:', error);
      alert('Error saving test. Please try again.');
    }
  };
  useEffect(() => {
    console.log("Updated testDetails.questions:", testDetails.questions);
  }, [testDetails.questions]);
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
          <input
            type="text"
            className={styles.testInputText}
            placeholder="Subject Name"
            value={testDetails.subjectName}
            onChange={(e) => setTestDetails({ ...testDetails, subjectName: e.target.value })}
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
          <input
            type="number"
            className={styles.testInputNumber}
            placeholder="Test Duration (minutes)"
            value={testDetails.testDuration}
            onChange={(e) => setTestDetails({ ...testDetails, testDuration: e.target.value })}
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
          <label className={styles.testLabel}>Upload Questions File</label>
          <input
            type="file"
            className={styles.testFileInput}
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
          {questionsFile && (
            <p className={styles.fileInfo}>Selected File: {questionsFile.name}</p>
          )}
          <button className={styles.testButton} onClick={handlePrevious}>Back</button>
          <button className={styles.testButton} onClick={handleNext}>Next</button>
        </div>
      )}

{step === 3 && (
        <div>
          <h2 className={styles.testHeading}>Step 3: Batch Entry</h2>
          <label className={styles.testLabel}>
            Enter Batch Manually
          </label>
          <div>
            <input
              type="text"
              className={styles.testInputText}
              placeholder="Batch Name"
              value={batchInput.batchName}
              onChange={(e) => setBatchInput({ ...batchInput, batchName: e.target.value })}
            />
            <input
              type="text"
              className={styles.testInputText}
              placeholder="Department"
              value={batchInput.department}
              onChange={(e) => setBatchInput({ ...batchInput, department: e.target.value })}
            />
            <input
              type="text"
              className={styles.testInputText}
              placeholder="Branch"
              value={batchInput.branch}
              onChange={(e) => setBatchInput({ ...batchInput, branch: e.target.value })}
            />
            <input
              type="text"
              className={styles.testInputText}
              placeholder="Year"
              value={batchInput.year}
              onChange={(e) => setBatchInput({ ...batchInput, year: e.target.value })}
            />
            <button className={styles.testButton} onClick={handleAddBatch}>Add Another Batch</button>
            {error && <p className={styles.errorText}>{error}</p>} {/* Display error if present */}
          </div>

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
          <p>Full Screen: <span className={styles.reviewHighlight}>{testDetails.isFullScreenEnforced ? 'Yes' : 'No'}</span></p>
          <p>Tab Switch Prevention: <span className={styles.reviewHighlight}>{testDetails.isTabSwitchPreventionEnabled ? 'Yes' : 'No'}</span></p>
          <p>Camera Required: <span className={styles.reviewHighlight}>{testDetails.isCameraAccessRequired ? 'Yes' : 'No'}</span></p>
          <p>Batch Details:</p>
          <ul>
            {testDetails.batchDetails.map((batch, index) => (
              <li key={index}>
                Batch Name: {batch.batchName}, Department: {batch.department}, Branch: {batch.branch}, Year: {batch.year}
              </li>
            ))}
          </ul>
          <button className={styles.testButton} onClick={handlePrevious}>Back</button>
          <button className={styles.testButton} onClick={handleSaveTest}>Save Test</button>
        </div>
      )}
    </div>
  );
};

export default TestCreation;
