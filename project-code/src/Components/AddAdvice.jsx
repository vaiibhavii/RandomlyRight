import React, { useState } from 'react';
import './AddAdvice.css';

const AddAdvice = () => {
  const [advice, setAdvice] = useState('');
  const [category, setCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (advice.trim() && category.trim()) {
      // Save advice logic here (e.g., send to Firestore)
      setSuccessMessage('Your advice has been added! Thank you for sharing your wisdom. 🌟');
      setAdvice('');
      setCategory('');
    } else {
      alert('Please fill in all fields before submitting.');
    }
  };

  return (
    <div className="add-advice-page">
      <div className="form-container">
        <h1 className="form-heading">Share Your Wisdom 💡</h1>
        <p className="form-subheading">
          Inspire someone today! Write advice that might brighten someone's day or guide them through a challenge.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="advice" className="form-label">Your Advice</label>
            <textarea
              id="advice"
              className="form-control input-advice"
              placeholder="e.g., Stay positive and work hard to achieve your dreams."
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              className="form-control input-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Select a Category --</option>
              <option value="Daily Life Hacks">Daily Life Hacks</option>
              <option value="Friendships, Feels, and Social Stuff">
                Friendships, Feels, and Social Stuff
              </option>
              <option value="School, Work, and Hustle Tips">
                School, Work, and Hustle Tips
              </option>
              <option value="Mindset Check">Mindset Check</option>
              <option value="Life Upgrades">Life Upgrades</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <button type="submit" className="btn btn-submit">🌟 Add My Advice</button>
        </form>

        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
};

export default AddAdvice;
