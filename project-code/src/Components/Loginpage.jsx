import React from 'react';
import './Login.css';  // Custom CSS file

function Login() {
    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="form-container p-4">
                {/* Image placeholder */}
                <div className="image-placeholder mb-3">
                    <img src="https://via.placeholder.com/100" alt="Login" className="img-fluid" />
                </div>

                <h2 className="text-center text-white mb-4">Login</h2>

                <form>
                    <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary custom-btn-primary">
                            Login
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <a href="#" className="forgot-password">Forgot Password?</a> |
                    <a href="#" className="create-account">Create an Account</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
