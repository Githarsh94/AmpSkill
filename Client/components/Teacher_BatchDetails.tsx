import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/TeacherBatches.module.css';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
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
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:3000/api/teacher//dashboard/batch/getStudents', { batchName, department, branch, year, teacherEmail });
        setStudents(response.data.students);
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

  const handleUpdateBatch = async () => {
    try {
      const response = await axios.put('/api/updateBatch', {
        batchName,
        department,
        branch,
        year,
        teacherEmail,
        updates: batchUpdates,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating batch:', error);
    }
  };

  return (
    <div className={styles['batch-details']}>
      {loading ? (
        <p className={styles['batch-details__loading']}>Loading students...</p>
      ) : (
        <>
          <h3 className={styles['batch-details__heading']}>Students in {batchName}</h3>
          <ul className={styles['batch-details__students-list']}>
            {students.map((student) => (
              <li key={student._id} className={styles['batch-details__student-item']}>
                {student.name} ({student.rollNumber})
              </li>
            ))}
          </ul>
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
          <button onClick={handleUpdateBatch} className={styles['batch-details__button']}>
            Submit Update
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchDetails;