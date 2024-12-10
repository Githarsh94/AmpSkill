import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateReport } from '../Services/admin';
interface ReportData {
    totalUsers: number;
    adminCount: number;
    teacherCount: number;
    studentCount: number;
    totalBatches: number;
    batchDetails: {
        _id: string;
        batchName: string;
        department: string;
        branch: string;
        year: number;
    }[];
    totalTests: number;
    testDetails: {
        title: string;
        testCode: string;
        date: string;
    }[];
}

const GenerateReport = () => {
    const [year, setYear] = useState('');

    const handleGenerateReport = async () => {
        console.log(`Generating report for the year: ${year}`);
        try {
            const data: ReportData = await generateReport(parseInt(year, 10));
            console.log(data);
            // Create a new jsPDF instance
            const doc = new jsPDF();

            // Add title to the PDF
            doc.text(`Report for the year: ${year}`, 20, 10);

            // Add summary to the PDF
            doc.text(`Total Users: ${data.totalUsers}`, 20, 20);
            doc.text(`Admin Count: ${data.adminCount}`, 20, 30);
            doc.text(`Teacher Count: ${data.teacherCount}`, 20, 40);
            doc.text(`Student Count: ${data.studentCount}`, 20, 50);
            doc.text(`Total Batches: ${data.totalBatches}`, 20, 60);
            doc.text(`Total Tests: ${data.totalTests}`, 20, 70);

            // Add batch details table to the PDF
            autoTable(doc, {
                startY: 80,
                head: [['Batch Name', 'Department', 'Branch', 'Year']],
                body: data.batchDetails.map((batch) => [
                    batch.batchName,
                    batch.department,
                    batch.branch,
                    batch.year.toString(),
                ]),
            });

            const batchDetailsY = (doc as any).lastAutoTable.finalY || 0;

            // Add test details table to the PDF
            autoTable(doc, {
                startY: batchDetailsY + 10, // Use the final Y from the previous table
                head: [['Title', 'Test Code', 'Date']],
                body: data.testDetails.map((test) => [
                    test.title,
                    test.testCode,
                    new Date(test.date).toLocaleDateString(),
                ]),
            });

            // Save the PDF
            doc.save(`report_${year}.pdf`);
        } catch (err) {
            console.error('Error generating the report:', err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Generate Report</h1>
            <div className="mb-4">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Select Year
                </label>
                <select
                    id="year"
                    name="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">Select a year</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                        <option key={yr} value={yr}>
                            {yr}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleGenerateReport}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Generate Report
            </button>
        </div>
    );
};

export default GenerateReport;
