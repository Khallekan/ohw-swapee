import { useState, useEffect } from 'react';

import { Redirect } from 'react-router';

import '../../css/SignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [shouldRememberMe, setShouldRememberMe] = useState(false);

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true);

    const [isDocumentError, setIsDocumentError] = useState(false);

    const [isSignInSuccess, setIsSignInSuccess] = useState(false);

    // Stores the user input in state
    const handleUserInput = ({ target: { name, value } }) => {
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                console.log('Something went wrong.');
        }
    };

    // Toggles the visibility of the password input
    const togglePasswordType = () => {
        passwordType === 'password'
            ? setPasswordType('text')
            : setPasswordType('password');
    };

    // Validates the email input
    useEffect(() => {
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        setIsEmailValid(emailRegex.test(email));
    }, [email]);

    // Validates the password input
    useEffect(() => setIsPasswordValid(password.length >= 8), [password]);

    // Controls the disabling of the submit button
    useEffect(() => {
        isEmailValid && isPasswordValid
            ? setIsSubmitBtnDisabled(false)
            : setIsSubmitBtnDisabled(true);
    }, [isEmailValid, isPasswordValid]);

    const submitSignInData = (event) => {
        event.preventDefault();

        const signInData = {
            email,
            password
        };

        const endpoint =
            'https://bartertradeapi.herokuapp.com/auth/jwt/create/';

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signInData)
        };

        const postSignInData = async () => {
            try {
                const response = await fetch(endpoint, requestOptions);
                const { refresh, access } = await response.json();

                if (shouldRememberMe) {
                    localStorage.setItem('bartertrade', refresh);
                    sessionStorage.removeItem('bartertrade');
                } else {
                    localStorage.removeItem('bartertrade');
                    sessionStorage.setItem('bartertrade', refresh);
                }

                if (response.ok) {
                    const authBearerTokenParams = {
                        token: access
                    };
                    const authBearerTokenOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(authBearerTokenParams)
                    };

                    const authBearerTokenUrl = `https://bartertradeapi.herokuapp.com/auth/jwt/verify/`;
                    const authBearerTokenResp = await fetch(
                        authBearerTokenUrl,
                        authBearerTokenOptions
                    );

                    const authBearerTokenData =
                        await authBearerTokenResp.json();
                    console.log(authBearerTokenData);
                    if (authBearerTokenResp.ok) {
                        console.log(authBearerTokenData);
                        setIsSignInSuccess(true);
                    }
                } else {
                    setIsDocumentError(true);
                }
            } catch (error) {
                throw new Error(error);
            }
        };

        postSignInData();
    };

    return (
        <>
            {isSignInSuccess ? (
                <Redirect to='/' />
            ) : (
                <div className='wrapper'>
                    <h2>Log in</h2>
                    <form className='sign-in-form' onSubmit={submitSignInData}>
                        <div
                            className={`email-box info-box ${
                                !isEmailValid && 'error'
                            }`}
                        >
                            <label htmlFor='email'>
                                Email{' '}
                                {!isEmailValid && (
                                    <span className='error-text'>
                                        Enter a valid email address
                                    </span>
                                )}
                            </label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={email}
                                placeholder='Enter email'
                                autoFocus
                                required
                                aria-required={true}
                                onChange={handleUserInput}
                            />
                        </div>
                        <div
                            className={`password-box info-box ${
                                !isPasswordValid && 'error'
                            }`}
                        >
                            <label htmlFor='pass'>
                                Password{' '}
                                {!isPasswordValid && (
                                    <span className='error-text'>
                                        must be 8 or more characters long
                                    </span>
                                )}
                            </label>
                            <input
                                type={passwordType}
                                className='togglePassword'
                                id='pass'
                                name='password'
                                value={password}
                                minLength='8'
                                placeholder='Enter password'
                                required
                                aria-required={true}
                                onChange={handleUserInput}
                            />
                            {password.length > 0 && (
                                <i
                                    className='far fa-eye-slash'
                                    style={{
                                        marginLeft: '-30px; cursor: pointer'
                                    }}
                                    onClick={togglePasswordType}
                                ></i>
                            )}
                        </div>
                        <div className='help-login info-box'>
                            <div>
                                <input
                                    type='checkbox'
                                    id='remember-me'
                                    name='remember-me'
                                    checked={shouldRememberMe}
                                    onChange={() =>
                                        setShouldRememberMe(
                                            (prevState) => !prevState
                                        )
                                    }
                                />
                                <label
                                    htmlFor='remember-me'
                                    className='checkbox'
                                ></label>
                                <label htmlFor='remember-me'>Remember me</label>
                            </div>
                            <a href='../Password_verification/index.html'>
                                Forgot password
                            </a>
                        </div>
                        <input
                            type='submit'
                            className='sign-in-btn'
                            style={{
                                opacity: isSubmitBtnDisabled ? '0.5' : '1'
                            }}
                            disabled={isSubmitBtnDisabled}
                            value='Sign in'
                        />
                    </form>
                    <p>
                        Don’t have an account?
                        <a
                            className='register'
                            id='sign-in'
                            href='../signup\signup.html'
                        >
                            Sign up
                        </a>
                    </p>
                    {isDocumentError && (
                        <div className='document_error' id='document_error'>
                            Please sign up or click the link in the email sent
                            to you
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default SignIn;
