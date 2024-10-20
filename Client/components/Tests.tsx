import React, { useState } from 'react';
import styles from '../styles/test.module.css';

type BatchDetails = {
  batchName: string;
  department: string;
  branch: string;
  year: string;
};

type TestDetails = {
  title: string;
  description: string;
  startTime: string;
  loginWindow: string;
  testDuration: string;
  isFullScreenEnforced: boolean;
  isTabSwitchPreventionEnabled: boolean;
  isCameraAccessRequired: boolean;
  questionsFile: File | null;
  batchesFile: File | null;
  batchDetails: BatchDetails[];
};

const TestCreation: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [manualBatchEntry, setManualBatchEntry] = useState<boolean>(false);
  const [batchInput, setBatchInput] = useState<BatchDetails>({
    batchName: '',
    department: '',
    branch: '',
    year: '',
  });
  const [error, setError] = useState<string>(''); // Add error state

  const [testDetails, setTestDetails] = useState<TestDetails>({
    title: '',
    description: '',
    startTime: '',
    loginWindow: '',
    testDuration: '',
    isFullScreenEnforced: false,
    isTabSwitchPreventionEnabled: false,
    isCameraAccessRequired: false,
    questionsFile: null,
    batchesFile: null,
    batchDetails: [],
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTestDetails({ ...testDetails, questionsFile: e.target.files[0] });
    }
  };

  const handleBatchFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTestDetails({ ...testDetails, batchesFile: e.target.files[0] });
    }
  };

  // Update the handleAddBatch function to check for empty fields and set an error message if needed
  const handleAddBatch = () => {
    if (!batchInput.batchName || !batchInput.department || !batchInput.branch || !batchInput.year) {
      setError('All batch fields must be filled out before adding.');
      return; // Do not add the batch if any field is empty
    }

    // If all fields are valid, add the batch and clear the input fields and error
    setTestDetails({
      ...testDetails,
      batchDetails: [...testDetails.batchDetails, batchInput],
    });
    setBatchInput({ batchName: '', department: '', branch: '', year: '' });
    setError(''); // Clear the error message if the batch is successfully added
  };

  const handleSaveTest = async () => {
    const formData = new FormData();

    // Add non-file fields to formData
    formData.append('title', testDetails.title);
    formData.append('description', testDetails.description);
    formData.append('startTime', testDetails.startTime);
    formData.append('loginWindow', testDetails.loginWindow);
    formData.append('testDuration', testDetails.testDuration);
    formData.append('isFullScreenEnforced', String(testDetails.isFullScreenEnforced));
    formData.append('isTabSwitchPreventionEnabled', String(testDetails.isTabSwitchPreventionEnabled));
    formData.append('isCameraAccessRequired', String(testDetails.isCameraAccessRequired));

    // Add files (if present) to formData
    if (testDetails.questionsFile) {
      formData.append('questionsFile', testDetails.questionsFile);
    }

    if (testDetails.batchesFile) {
      formData.append('batchesFile', testDetails.batchesFile);
    }

    // Add the batch details as a JSON string
    formData.append('batches', JSON.stringify(testDetails.batchDetails));

    try {
      // Make the API request to upload the test
      // const response = await fetch('/teacher/dashboard/test/uploadTest', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error('Error uploading test:', errorData.message);
      //   alert(`Error: ${errorData.message}`);
      //   return;
      // }

      // If successful, notify the user
      // const responseData = await response.json();
      alert('Test created successfully!');
    } catch (error) {
      console.error('Error saving test:', error);
      alert('Error saving test. Please try again.');
    }
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
          <input
            type="number"
            className={styles.testInputNumber}
            placeholder="test Duration (minutes)"
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

          {/* Add file upload for questions */}
          <div>
            <label className={styles.testLabel}>Upload Questions File</label>
            <input
              type="file"
              className={styles.testFileInput}
              accept=".csv, .xlsx"
              onChange={handleFileUpload}
            />
            {testDetails.questionsFile && (
              <p className={styles.fileInfo}>
                Selected File: {testDetails.questionsFile.name}
              </p>
            )}
          </div>

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