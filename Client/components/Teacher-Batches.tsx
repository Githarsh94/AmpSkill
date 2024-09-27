import { useEffect, useState } from 'react';
import axios from 'axios';
import BatchDetails from './Teacher_BatchDetails';
import { useUserStore } from '../store/user';
import styles from '../styles/TeacherBatches.module.css';

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
      try {
        const response = await axios.post('http://localhost:3000/api/teacher/dashboard/batch/view', { teacherEmail });
        if (response.status === 200) {
          console.log(response.data.batches);
          setBatches(response.data.batches);
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