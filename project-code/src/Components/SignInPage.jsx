import React, { useState } from 'react';
import './SignIn.css'; // Assuming you're putting custom CSS in this file
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc'; // Google Icon

function SignIn() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Sign-up successful!');
        } catch (error) {
            console.error('Error signing up:', error.message);
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithPopup(auth, googleProvider);
            alert('Sign-up successful!');
        } catch (error) {
            console.error('Error signing up:', error.message);
            setError(error.message);
        }
    };

    return (
        <div className="sign-in-container d-flex justify-content-center align-items-center">
            <div className="form-container p-4">
                <div className="image-placeholder mb-3">
                    <img src="https://via.placeholder.com/100" alt="Sign In" className="img-fluid" />
                </div>

                <h2 className="text-center text-white mb-4">Sign In</h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSignUp}>
                    <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary custom-btn-primary">
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <button
                        onClick={handleGoogleSignIn}
                        className="btn custom-btn-google d-flex align-items-center justify-content-center"
                    >
                        Log in with   
                        <FcGoogle className="mx-2" size={20} />
                    </button>
                </div>

                <div className="text-center mt-3">
                    <a href="/login" className="forgot-password">Already have an account? Log in</a>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
