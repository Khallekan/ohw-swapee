import { useState, useEffect } from 'react';

import { Redirect } from 'react-router';

import { Link } from 'react-router-dom';

import '../../css/SignUp.css';

const SignUp = () => {
    const [signUpData, setSignUpData] = useState({
        name: '',
        password: '',
        retypePassword: '',
        email: ''
    });
    const [acceptTerms, setAcceptTerms] = useState(false);

    const [passwordType, setPasswordType] = useState('password');
    const [retypePasswordType, setRetypePasswordType] = useState('password');

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);
    const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true);

    const [errorMessages, setErrorMessages] = useState({
        username: 'Enter a username',
        email: 'Enter a valid email address',
        password: 'must be 8 or more characters long'
    });

    const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

    // Stores the user input in state
    const handleUserInput = ({ target: { name, value } }) => {
        setSignUpData((prevState) => ({ ...prevState, [name]: value }));
    };

    // Validates the email input
    useEffect(() => {
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        setIsEmailValid(emailRegex.test(signUpData.email));
    }, [signUpData.email]);

    // Validates the password input
    useEffect(
        () => setIsPasswordValid(signUpData.password.length >= 8),
        [signUpData.password]
    );

    // Checks if the two password inputs match
    useEffect(
        () =>
            setDoPasswordsMatch(
                signUpData.password === signUpData.retypePassword
            ),
        [signUpData.password, signUpData.retypePassword]
    );

    // Toggles the visibility of the password input
    const togglePasswordType = () => {
        passwordType === 'password'
            ? setPasswordType('text')
            : setPasswordType('password');
    };

    // Toggles the visibility of the retype-password input
    const toggleRetypePasswordType = () => {
        retypePasswordType === 'password'
            ? setRetypePasswordType('text')
            : setRetypePasswordType('password');
    };

    // Controls the disabling of the submit button
    useEffect(() => {
        isEmailValid && isPasswordValid && doPasswordsMatch && acceptTerms
            ? setIsSubmitBtnDisabled(false)
            : setIsSubmitBtnDisabled(true);
    }, [isEmailValid, isPasswordValid, doPasswordsMatch, acceptTerms]);

    const submitSignUpData = (event) => {
        event.preventDefault();

        const signUpDetails = {
            username: signUpData.name,
            email: signUpData.email,
            password: signUpData.password
        };
        const endpoint = 'https://bartertradeapi.herokuapp.com/auth/users/';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpDetails)
        };

        const postSignUpData = async () => {
            try {
                const response = await fetch(endpoint, requestOptions);
                const { username, email, password } = await response.json();

                if (Array.isArray(username)) {
                    setErrorMessages((prevState) => ({
                        ...prevState,
                        username
                    }));
                }

                if (Array.isArray(email)) {
                    setErrorMessages((prevState) => ({ ...prevState, email }));
                }

                if (Array.isArray(password)) {
                    setErrorMessages((prevState) => ({
                        ...prevState,
                        password
                    }));
                }

                if (response.ok) {
                    setIsSignUpSuccess(true);
                }
            } catch (error) {
                throw new Error(error);
            }
        };

        postSignUpData();
    };

    return (
        <>
            {isSignUpSuccess ? (
                <Redirect to='/signin' />
            ) : (
                <div className='wrapper'>
                    <h2>Create an Account</h2>
                    <form
                        id='form'
                        className='sign-up-form'
                        onSubmit={submitSignUpData}
                    >
                        <div
                            className={`name-box info-box ${
                                !signUpData.name.length && 'error'
                            }`}
                        >
                            <label htmlFor='name'>
                                Name{' '}
                                {!signUpData.name.length && (
                                    <span className='error-text'>
                                        {errorMessages.username}
                                    </span>
                                )}
                            </label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={signUpData.name}
                                placeholder='Enter name'
                                required
                                aria-required={true}
                                autoFocus
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
                                        {errorMessages.password}
                                    </span>
                                )}
                            </label>
                            <input
                                type={passwordType}
                                className='togglePassword'
                                name='password'
                                value={signUpData.password}
                                id='pass'
                                minLength='8'
                                placeholder='Enter password'
                                required
                                aria-required={true}
                                onChange={handleUserInput}
                            />
                            {signUpData.password.length > 0 && (
                                <i
                                    className='far fa-eye-slash'
                                    style={{
                                        marginLeft: '-30px; cursor: pointer'
                                    }}
                                    onClick={togglePasswordType}
                                ></i>
                            )}
                        </div>
                        <div
                            className={`password-box info-box ${
                                !doPasswordsMatch && 'error'
                            }`}
                        >
                            <label htmlFor='retype-pass'>
                                Retype password{' '}
                                {!doPasswordsMatch && (
                                    <span className='error-text'>
                                        Not the same as password
                                    </span>
                                )}
                            </label>
                            <input
                                type={retypePasswordType}
                                className='togglePassword'
                                name='retypePassword'
                                value={signUpData.retypePassword}
                                id='retype-pass'
                                minLength='8'
                                placeholder='Enter password'
                                required
                                aria-required={true}
                                onChange={handleUserInput}
                            />
                            {signUpData.retypePassword.length > 0 && (
                                <i
                                    className='far fa-eye-slash'
                                    style={{
                                        marginLeft: '-30px; cursor: pointer'
                                    }}
                                    onClick={toggleRetypePasswordType}
                                ></i>
                            )}
                        </div>
                        <div
                            className={`email-box info-box ${
                                !isEmailValid && 'error'
                            }`}
                        >
                            <label htmlFor='email'>
                                Email{' '}
                                {!isEmailValid && (
                                    <span className='error-text'>
                                        {errorMessages.email}
                                    </span>
                                )}
                            </label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={signUpData.email}
                                placeholder='Enter email address'
                                required
                                aria-required={true}
                                onChange={handleUserInput}
                            />
                            <p>We’ll never share your email with anyone else</p>
                        </div>
                        <div className='terms-box info-box'>
                            <input
                                type='checkbox'
                                name='terms'
                                checked={acceptTerms}
                                id='terms'
                                required
                                aria-required={true}
                                onChange={() =>
                                    setAcceptTerms((prevState) => !prevState)
                                }
                            />
                            <label htmlFor='terms' className='checkbox'></label>
                            <label htmlFor='terms'>
                                I agree to the <Link to='/signup'>Terms</Link>{' '}
                                and
                                <Link to='/signup'>conditions</Link>
                            </label>
                        </div>
                        <input
                            type='submit'
                            className='sign-up-btn'
                            style={{
                                opacity: isSubmitBtnDisabled ? '0.5' : '1'
                            }}
                            disabled={isSubmitBtnDisabled}
                            value='Sign up'
                        />
                    </form>
                    <div className='bottom-txt'>
                        <p>
                            By clicking the Sign Up button, you confirm that you
                            accept our
                            <Link to='/signup'>Terms of use</Link> and{' '}
                            <Link to='/signup'>Privacy Policy</Link>
                        </p>
                        <p>
                            Have an account?
                            <Link to='/signin' className='register' id='log-in'>
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SignUp;
