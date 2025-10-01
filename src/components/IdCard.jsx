import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

// MOCK IMPLEMENTATIONS for Print and Environment
// NOTE: In your local project, replace these mocks with the actual imports:
// import { useReactToPrint } from 'react-to-print';
const useReactToPrint = ({ content, documentTitle, pageStyle }) => {
    return () => {
        const componentToPrint = content();
        if (componentToPrint) {
            // Using alert() to simulate the print dialog opening in this environment
            alert(`Triggering Print for: ${documentTitle}. Component ready to print in specified size.`);
        } else {
            console.error("Content reference is null. Cannot print.");
        }
    };
};
// Mock BASE_URL (Replace with import.meta.env.VITE_SERVER_URL in your project)
const BASE_URL = 'https://mock-api.yourserver.com/api'; 


const IdCard = () => {
    const { studentId } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();

    // --- MOCK DATA FETCH (REPLACE WITH YOUR ACTUAL FETCH) ---
    useEffect(() => {
        const fetchStudent = async () => {
            // Your real fetch logic would go here:
            // const res = await fetch(`${BASE_URL}/students/${studentId}`);

            // Mock Data for demonstration
            const MOCK_DATA = {
                studentPhoto: "https://placehold.co/150x150/003366/ffffff?text=PHOTO",
                name: "DVBDSH KUMAR",
                class: "11",
                serialNumber: "2022DVBD01012005",
                dob: "2005-01-01",
                parents: [{ relation: 'Father', name: 'RAJESH SINGH' }],
                rollNumber: '007', 
                validUpto: '10/2026',
            };

            try {
                // Simulate fetch delay
                await new Promise(resolve => setTimeout(resolve, 500)); 
                // In your real code, this line would be: setStudentData(await res.json());
                setStudentData(MOCK_DATA);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setLoading(false);
            }
        };
        // In a real app, you would fetch the data based on studentId
        if (studentId) { 
            fetchStudent();
        } else {
            // Fallback for demonstration if studentId is not found in URL (e.g., if you are viewing this component directly)
            fetchStudent(); 
        }
    }, [studentId]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Student ID Card',
        // Set page size to PAN card dimensions for printing
        pageStyle: `@page { size: 85.6mm 53.98mm; margin: 0; }`
    });

    // Add a loading state to prevent destructuring errors
    if (loading || !studentData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-600">Loading ID card...</p>
            </div>
        );
    }

    // --- Destructuring with Aliases and Defaults ---
    const {
        studentPhoto: photo,
        name,
        'class': classDetails,
        serialNumber,
        admissionYear,
        dob,
        rollNumber = 'N/A', 
        validUpto = 'N/A',
        fathersName = studentData.parents?.find(p => p.relation === 'Father')?.name || 'N/A',
        qrCode = 'https://placehold.co/60x60/f8f8f8/000000?text=QR',
        schoolName = 'SPRINGDALE ACADEMY',
        schoolWebsite = 'www.springdaleacademy.com',
        principalSignature = "Principal's Signature"
    } = studentData;

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen font-sans">
            <style>
                {`
                    /* Inline CSS to fix the print issue (Equivalent to compoStyles.css) */
                    @media print {
                        @page { size: 85.6mm 53.98mm; margin: 0; }
                        .print-button, .no-print { display: none !important; }
                        .id-card-print-container { 
                            box-shadow: none !important; 
                            border-radius: 0 !important; 
                            width: 85.6mm !important; 
                            height: 53.98mm !important; 
                            overflow: hidden;
                            /* Reset transform that was used for scaling on screen */
                            transform: none !important;
                            scale: none !important;
                            margin: 0;
                            padding: 0;
                        }
                    }
                `}
            </style>
            
            <div 
                ref={componentRef} 
                className="id-card-print-container w-[450px] h-[285px] bg-white rounded-2xl overflow-hidden shadow-2xl transform scale-[0.6] sm:scale-100"
            >
                
                {/* ID CARD CONTENT START (Full JSX) */}
                
                {/* Header Section (Dark Blue) */}
                <div className="bg-[#003366] text-white p-4 flex justify-between items-center h-[20%]">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                        {/* Book/Logo Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M17.25 10.5V7.5m-3.75 3.75h.008v.008h-.008Zm-3.75 0h.008v.008h-.008Zm10.5-1.5a2.25 2.25 0 0 0-4.5 0V6.258a1.5 1.5 0 0 1-.565-1.125l-.04-2.583m-1.885 1.258a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-1.5A2.25 2.25 0 0 0 2.25 3h1.342m15.826 9.75h.008v.008h-.008Zm-8.826-1.5h.008v.008h-.008Z" />
                        </svg>
                    </div>
                    <div className="text-lg font-bold tracking-wide">{schoolName}</div>
                </div>

                {/* Student Info and Details */}
                <div className="flex p-4 pb-2 h-[65%]">
                    {/* Photo and Name Column */}
                    <div className="flex flex-col items-center w-1/3 text-center pr-2">
                        <img 
                            className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover" 
                            src={photo} 
                            alt="Student Photo" 
                        />
                        <h2 className="text-sm font-bold mt-2 text-[#333] leading-tight">{name}</h2>
                        <p className="text-xs text-gray-600 mt-0.5 leading-none">Class: {classDetails} | Roll No: {rollNumber}</p>
                    </div>

                    {/* Details Grid Column */}
                    <div className="w-2/3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-700">
                        <p className="font-semibold text-gray-900">Serial No:</p>
                        <p className="font-medium text-right truncate">{serialNumber}</p>

                        <p className="font-semibold text-gray-900">Admn. Year:</p>
                        <p className="font-medium text-right">{admissionYear}</p>
                        
                        <p className="font-semibold text-gray-900">Father:</p>
                        <p className="font-medium text-right truncate">{fathersName}</p>

                        <p className="font-semibold text-gray-900">DOB:</p>
                        <p className="font-medium text-right">{dob}</p>
                        
                        <p className="font-semibold text-gray-900">Valid Upto:</p>
                        <p className="font-medium text-right">{validUpto}</p>
                        
                        {/* QR Code and Signature Placeholder */}
                        <div className="col-span-2 flex justify-between items-center pt-2">
                            <span className="text-xs italic text-gray-500">Sign. Here</span>
                            <img src={qrCode} alt="QR Code" className="w-10 h-10" />
                        </div>
                    </div>
                </div>
                
                {/* Footer Section (Light Blue) */}
                <div className="bg-[#b3e0f2] text-[#003366] p-2 flex justify-between items-center text-[10px] h-[15%]">
                    <p>{schoolWebsite}</p>
                    <p className="italic">{principalSignature}</p>
                </div>

                {/* ID CARD CONTENT END */}
            </div>
            
            {/* Print Button */}
            <button 
                onClick={handlePrint} 
                className="print-button mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
                🖨️ Print ID Card (PAN Size)
            </button>
            <p className="mt-4 text-sm text-gray-500">
                Note: The card is scaled on screen. Printing will use actual 85.6mm x 53.98mm size.
            </p>
        </div>
    );
};

export default IdCard;
