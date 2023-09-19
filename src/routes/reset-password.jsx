import { useEffect, useState } from "react";
import AuthenticationLogo from "components/icons/AuthenticationLogo"
import AuthenticationLayout from "layouts/AuthenticationLayout"
import { Link } from "react-router-dom"
import axios from 'axios';
import SuccessAlert from "components/common/SuccessAlert";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import ErrorAlert from "components/common/ErrorAlert";

// Axios
axios.defaults.withCredentials = true

export default function ResetPassword() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [email, setEmail] = useState(null);
    const [submitButtonText, setSubmitButtonText] = useState('Send reset link');
    const [submitButtonDisabled, setSubmitButtonTextDisabled] = useState(false);

    // Set page title
    useEffect(() => {
        document.title = 'Reset Your Password';
    }, []);

    function reset() {
        axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
        setSubmitButtonText('Sending...');
        setSubmitButtonTextDisabled(true);

        // Get user detail
        axios.post('/api/reset-password', {
          email: email,
        })
          .then(function (response) {
            // handle success
            setSuccessMessage(response.data.message)
            setSubmitButtonText('Send reset link');
            setSubmitButtonTextDisabled(false);
          })
          .catch(function (error) {
            // handle error
            //setIsLoaded(true);
            setErrorMessage(error.response.data.message)
            setSubmitButtonText('Send reset link');
            setSubmitButtonTextDisabled(false);
            if(error.response.data.errors) {
                setValidationErrors(error.response.data.errors);
            }
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

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address <span className="text-red-800">*</span>
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    placeholder="Enter email here"
                                    id="email"
                                    name="email"
                                    onChange={(ev) => setEmail(ev.target.value)}
                                    type="email"
                                    className={ (validationErrors.email) ? 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                                />
                                {validationErrors.email && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
                                </div>}
                            </div>
                            {validationErrors.email && <p className="mt-2 text-sm text-red-800">{validationErrors.email}</p>}
                        </div>

                        <div>
                            <button disabled={!email || submitButtonDisabled} onClick={reset} type="submit"
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
