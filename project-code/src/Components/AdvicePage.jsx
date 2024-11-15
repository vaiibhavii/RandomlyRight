import React, { useState, useEffect } from 'react';
import './AdvicePage.css';
// import { db } from '../Config/firebaseConfig'; // Adjust the import path as necessary
// import { collection, getDocs } from 'firebase/firestore';

const AdvicePage = () => {
    const [advice, setAdvice] = useState('');
    const [autoFetch, setAutoFetch] = useState(false);

    // Function to fetch a random piece of advice from Firestore
    const fetchAdvice = async () => {
        try {
            // const adviceCollection = collection(db, 'advices'); // Ensure 'advices' matches your Firestore collection name
            // const adviceSnapshot = await getDocs(adviceCollection);
            // const adviceList = adviceSnapshot.docs.map(doc => doc.data().advice); // Assuming each document has an 'advice' field
            // const randomAdvice = adviceList[Math.floor(Math.random() * adviceList.length)];
            // setAdvice(randomAdvice);
        } catch (error) {
            console.error("Error fetching advice:", error);
        }
    };

    useEffect(() => {
        fetchAdvice(); // Fetch advice when the component mounts

        let interval;
        if (autoFetch) {
            interval = setInterval(fetchAdvice, 10000); // Fetch new advice every 10 seconds if autoFetch is enabled
        }
        return () => clearInterval(interval);
    }, [autoFetch]);

    return (
        <div className="advice-page">
            <div className="advice-container">
                <p className="advice-text">{advice}</p>
                <div className="reaction-buttons">
                    <button>😊</button>
                    <button>👍</button>
                    <button>❤️</button>
                    <button>😂</button>
                    <button>😮</button>
                </div>
                <div className="action-buttons">
                    <button className="report-button">Report</button>
                    <button className="next-button" onClick={fetchAdvice}>Next</button>
                </div>
                <label className="auto-fetch-label">
                    <input type="checkbox" checked={autoFetch} onChange={() => setAutoFetch(!autoFetch)} />
                    Auto-fetch advice
                </label>
            </div>
            <button className="share-button">Share</button>
        </div>
    );
};

export default AdvicePage;
