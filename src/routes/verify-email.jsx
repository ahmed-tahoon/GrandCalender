import { useEffect, useState } from "react";
import AuthenticationLogo from "components/icons/AuthenticationLogo"
import AuthenticationLayout from "layouts/AuthenticationLayout"
import { useLoaderData } from "react-router-dom"
import axios from 'axios';
import ErrorAlert from "components/common/ErrorAlert";
import { Link } from "react-router-dom";
import Countdown, { zeroPad } from 'react-countdown';

// Axios
axios.defaults.withCredentials = true

export default function VerifyEmail() {
    const { user } = useLoaderData();
    const [errorMessage, setErrorMessage] = useState(null);
    const [otp, setOtp] = useState(null);
    const [resendButtonText, setResendButtonText] = useState('resend OTP');
    const [resendButtonDisabled, setResendButtonDisabled] = useState(false);
    const [submitButtonText, setSubmitButtonText] = useState('Verify');
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [countDownTimer, setCountDownTimer] = useState(null);
    const renderer = ({ minutes, seconds }) => (
      <span>
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );


    function redirectRoute (route) {
        localStorage.removeItem('login_token');
        location.href = route;
    }

    // Set page title
    useEffect(() => {
        document.title = 'Verify Email';
    }, []);

    function verify() {
        axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
        setSubmitButtonText('Verifying...');
        setSubmitButtonDisabled(true);

        // Get user detail
        axios.post('/api/verify-email', {
          otp: otp,
        })
          .then(function (response) {
            // handle success
            //console.log(response.data);
            if(response.data.status === 'error') {
              setErrorMessage(response.data.message);
              setSubmitButtonText('Verify');
              setSubmitButtonDisabled(false);
            }
            if(response.data.status === 'success') {
              setSubmitButtonText('Verified, please wait..');
              window.location.href = '/dashboard'
            }
          })
          .catch(function (error) {
            // handle error
            //setIsLoaded(true);
            setErrorMessage('Something went wrong, please try again.')
            setSubmitButtonDisabled(false);
          })
          .then(function () {
            //setIsLoaded(true);
          });
      }

    function resendVerifyEmailOtp() {
        axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
        setResendButtonText('sending...');
        setResendButtonDisabled(true);

        // Get user detail
        axios.post('/api/resend-verify-email-otp')
          .then(function (response) {
            // handle success
            setResendButtonText('OTP sent')
            setCountDownTimer(<span>(<Countdown renderer={renderer} date={Date.now() + 50000} />)</span>)
            if(response.data.status === 'error') {
              setErrorMessage(response.data.message);
              setResendButtonDisabled(false);
            } else {
              setErrorMessage(null);
            }

            setTimeout(function() {
              setResendButtonText('resend OTP')
              setCountDownTimer(null)
              setResendButtonDisabled(false);
            }, 50000)
          })
          .catch(function (error) {
            // handle error\
            setErrorMessage('Something went wrong, please try again.')
            setResendButtonText('resend OTP')
            setCountDownTimer(null)
            setResendButtonDisabled(false);
          })
          .then(function () {
            //
          });
    }


    return (
        <AuthenticationLayout>
            <div>
                <AuthenticationLogo />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Welcome {user.name}</h2>
                <p className="mt-6 text-sm text-gray-600">
                  Thank you for registering with our service! We are excited to have you as a part of our community.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                To complete your registration, please enter the One-Time Password (OTP) that was sent to your email address <span className="font-medium text-black">{user.email}</span>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                This is an important step in verifying your account and ensuring its security.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                If you did not receive the OTP <span className="font-medium text-black">within an hour</span>, please click on <button disabled={resendButtonDisabled} onClick={resendVerifyEmailOtp} className="font-medium text-grandkit-600 hover:text-grandkit-500">
                    {resendButtonText} {countDownTimer}
                    </button> to request a new one.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                Thank you for choosing our service. We look forward to serving you!
                </p>
            </div>

            <div className="mt-8">
                <div className="mt-6">
                    <div className="space-y-6">
                        {errorMessage && <ErrorAlert title={errorMessage} />}

                        <div>
                            {/* <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                OTP
                            </label> */}
                            <div className="mt-1">
                                <input onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP here" name="otp" type="text" required
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-grandkit-500 focus:outline-none focus:ring-grandkit-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <button onClick={verify} disabled={!otp || submitButtonDisabled} type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:bg-gray-600 disabled:opacity-70">
                                {submitButtonText}
                            </button>
                        </div>

                        {/* Links to redirect to login, reset password, register but before go to this link remove token */}
                        <div className="space-y-2">
                            <div className="text-center text-sm">
                                    Don't have an account?
                                {/* Clear storage  */}
                                <button
                                    onClick={() => redirectRoute('register')}
                                    className="mx-1 font-medium text-grandkit-600 underline">Sign up </button>
                            </div>
                            <div className="text-center text-sm">
                                    Already have an account?
                                <button
                                    onClick={() => redirectRoute('login')}
                                    className="mx-1 font-medium text-grandkit-600 underline">Sign in</button>
                            </div>
                            <div className="text-center text-sm">
                                    Forget password?
                                <button
                                    onClick={() => redirectRoute('reset-password')}
                                    className="mx-1 font-medium text-grandkit-600 underline">Reset</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticationLayout>
    )
}
