import { useState, useEffect } from 'react';
import { handleUpdateBatch } from '@/Services/teacher';
import styles from '../styles/TeacherBatches.module.css';
import { auth } from '../lib/firebaseConfig';

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface BatchDetailsProps {
  batchName: string;
  department: string;
  branch: string;
  year: number;
  teacherEmail: string;
}

const BatchDetails: React.FC<BatchDetailsProps> = ({ batchName, department, branch, year, teacherEmail }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [batchUpdates, setBatchUpdates] = useState({
    batchName,
    department,
    branch,
    year,
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Toggle for the form


  useEffect(() => {
    // Fetch students of the batch
    const fetchStudents = async () => {
      let idToken = localStorage.getItem('sessionId');

      if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
      }
      setLoading(true);
      try {
        const response = await fetch('/teacher/dashboard/batch/getStudents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ batchName, department, branch, year, teacherEmail }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batchName, department, branch, year, teacherEmail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBatchUpdates({
      ...batchUpdates,
      [name]: value,
    });
  };

  return (
    <div className={styles['batch-details']}>
      {loading ? (
        <p className={styles['batch-details__loading']}>Loading students...</p>
      ) : (
        <>
          <h3 className={styles['batch-details__heading']}>Students in {batchName}</h3>
          <table className={styles['batch-details__students-table']}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined On</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Toggle Button to Show/Hide the Update Batch Form */}
      <button
        className={styles['batch-details__button']}
        onClick={() => setShowUpdateForm(!showUpdateForm)}
      >
        {showUpdateForm ? 'Hide Update Batch' : 'Update Batch'}
      </button>

      {/* Conditionally Render the Update Batch Form */}
      {showUpdateForm && (
        <div>
          <h3 className={styles['batch-details__heading']}>Update Batch</h3>
          <div className={styles['batch-details__form-group']}>
            <label className={styles['batch-details__label']}>Batch Name: </label>
            <input
              name="batchName"
              value={batchUpdates.batchName}
              onChange={handleInputChange}
              className={styles['batch-details__input']}
            />
          </div>
          <div className={styles['batch-details__form-group']}>
            <label className={styles['batch-details__label']}>Department: </label>
            <input
              name="department"
              value={batchUpdates.department}
              onChange={handleInputChange}
              className={styles['batch-details__input']}
            />
          </div>
          <div className={styles['batch-details__form-group']}>
            <label className={styles['batch-details__label']}>Branch: </label>
            <input
              name="branch"
              value={batchUpdates.branch}
              onChange={handleInputChange}
              className={styles['batch-details__input']}
            />
          </div>
          <div className={styles['batch-details__form-group']}>
            <label className={styles['batch-details__label']}>Year: </label>
            <input
              name="year"
              value={batchUpdates.year}
              onChange={handleInputChange}
              className={styles['batch-details__input']}
            />
          </div>
          <button onClick={() => handleUpdateBatch({ batchName, department, branch, year, teacherEmail, batchUpdates })} className={styles['batch-details__button']}>
            Submit Update
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchDetails;