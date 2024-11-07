import { useEffect, useState } from 'react';
import BatchDetails from './Teacher_BatchDetails';
import { useUserStore } from '../store/user';
import styles from '../styles/TeacherBatches.module.css';
import { auth } from '../lib/firebaseConfig';


interface Batch {
  _id: string;
  batchName: string;
  department: string;
  branch: string;
  year: number;
}

const TeacherBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const teacherEmail = useUserStore((state) => state.user.email);

  useEffect(() => {
    // Fetch the batches assigned to the teacher
    const fetchBatches = async () => {
      let idToken = localStorage.getItem('sessionId');

      if (!idToken) {
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated');
        }

        idToken = await user.getIdToken();
      }
      try {
        const response = await fetch('/teacher/dashboard/batch/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({ teacherEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.batches);
          setBatches(data.batches);
        } else {
          console.error('Error fetching batches:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, [teacherEmail]);

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBatchId = e.target.value;
    const batch = batches.find((b) => b._id === selectedBatchId) || null;
    setSelectedBatch(batch);
  };

  return (
    <div className={styles['teacher-batches']}>
      <h1 className={styles['teacher-batches__heading']}>Allocated Batches</h1>
      <select className={styles['teacher-batches__select']} onChange={handleBatchChange}>
        <option value="">Select a batch</option>
        {batches.map((batch) => (
          <option key={batch._id} value={batch._id} className={styles['teacher-batches__option']}>
            {batch.batchName} ({batch.department} - {batch.branch}, Year: {batch.year})
          </option>
        ))}
      </select>

      {selectedBatch && (
        <div className={styles['teacher-batches__details']}>
          <BatchDetails
            batchName={selectedBatch.batchName}
            department={selectedBatch.department}
            branch={selectedBatch.branch}
            year={selectedBatch.year}
            teacherEmail={teacherEmail}
          />
        </div>
      )}
    </div>
  );
};

export default TeacherBatches;