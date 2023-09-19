import { useEffect, useState } from "react";
import AuthenticationLogo from "components/icons/AuthenticationLogo"
import AuthenticationLayout from "layouts/AuthenticationLayout"
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom"
import axios from 'axios';
import SuccessAlert from "components/common/SuccessAlert";
import ErrorAlert from "components/common/ErrorAlert";
import PasswordStrengthBar from "react-password-strength-bar";

// Axios
axios.defaults.withCredentials = true

export default function ResetPasswordUpdate() {
    let { token } = useParams();
    let [searchParams, setSearchParams] = useSearchParams();

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [submitButtonText, setSubmitButtonText] = useState('Update password');
    const [submitButtonDisabled, setSubmitButtonTextDisabled] = useState(false);

    // Navigation
    const navigate = useNavigate();

    // Set page title
    useEffect(() => {
        document.title = 'Reset Your Password';
    }, []);

    function reset() {
        axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
        setSubmitButtonText('Updating...');
        setSubmitButtonTextDisabled(true);

        // Get user detail
        axios.post('/api/reset-password-update', {
          password: password,
          password_confirmation: repeatPassword,
          token: token,
          email: searchParams.get('email')
        })
          .then(function (response) {
            // handle success
            setSuccessMessage(response.data.message)
            setSubmitButtonText('Update password');
            setSubmitButtonTextDisabled(false);
            // Sleep and redirect to login
              setTimeout(() => {
                  // add login?email=from search params
                navigate('/login?email=' + searchParams.get('email'));
              }, 1500);
          })
          .catch(function (error) {
            // handle error
            //setIsLoaded(true);
            setErrorMessage(error.response.data.message)
            setSubmitButtonText('Update password');
            setSubmitButtonTextDisabled(false);
          })
          .then(function () {
            //setIsLoaded(true);
          });
      }


    return (
        <AuthenticationLayout>
            <div>
                <AuthenticationLogo />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Reset Your Password</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or{' '}
                    <Link to="/login" className="font-medium text-grandkit-600 hover:text-grandkit-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8">
                <div className="mt-6">
                    <div className="space-y-6">
                        {(errorMessage && !successMessage) && <ErrorAlert title={errorMessage} />}
                        {(!errorMessage && successMessage) && <SuccessAlert title={successMessage} />}

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1 mb-1">
                                <input id="password" onChange={(ev) => setPassword(ev.target.value)} name="password" type="password" required
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-grandkit-500 focus:outline-none focus:ring-grandkit-500 sm:text-sm" />
                            </div>
                            <PasswordStrengthBar password={password} />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="repeat_password" className="block text-sm font-medium text-gray-700">
                                Repeat New Password
                            </label>
                            <div className="mt-1">
                                <input id="repeat_password" onChange={(ev) => setRepeatPassword(ev.target.value)} name="repeat_password" type="password" required
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-grandkit-500 focus:outline-none focus:ring-grandkit-500 sm:text-sm" />
                            </div>
                            {(repeatPassword && password !== repeatPassword) && <p className="mt-2 text-sm text-red-800">Passwords do not match</p>}
                        </div>

                        <div>
                            <button disabled={!password || !repeatPassword || submitButtonDisabled || password !== repeatPassword} onClick={reset} type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:bg-gray-600 disabled:opacity-70">
                                {submitButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticationLayout>
    )
}
