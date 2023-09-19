import { useEffect } from "react";
import TimezoneSelectField from "components/fields/TimezoneSelectField"
import AuthenticationLogo from "components/icons/AuthenticationLogo"
import AuthenticationLayout from "layouts/AuthenticationLayout"
import { useState } from "react"
import { Form, Field } from 'react-final-form'
import axios from 'axios';
import { useLoaderData } from "react-router-dom";
import AvailabilityField from "components/fields/AvailabilityField";
import UsernameField from "components/fields/UsernameField";


// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

const steps = [
    { id: 'Step 1', name: 'Config your URL' },
    { id: 'Step 2', name: 'Set your availability' },
]

const requiredValidator = value => (value ? undefined : 'Required')
const usernameValidator = async function(value) {
    if(!value) {
        return 'Please enter a username'
    }

    // slug url validation no space and no special characters except dash regex
    const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if(!regex.test(value)) { return 'The URL format is invalid. Please use only lowercase letters (a-z), numbers, and hyphens.' }

    try {
        const response = await axios.post('/api/check-username', { username: value });
        return false;
    } catch (error) {
        if (error.response.status === 422) {
            return error.response.data.errors.username[0]
        }
    }
}
const availabilityDataValidator = value => {
    let valid = "At least one day need to be chosen"

    value.forEach((day) => {
        if(day.enabled === true) {
            valid = undefined
        }
    })

    return valid;
}

const availabilityData = [
    {
        name: "Sunday",
        enabled: false,
        slots: [
            {start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'}},
        ]
    },
    {
        name: "Monday",
        enabled: false,
        slots: [
            {start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'}}
        ]
    },
    {
        name: "Tuesday",
        enabled: false,
        slots: [
            {start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'}}
        ]
    },
    {
        name: "Wednesday",
        enabled: false,
        slots: [
            {start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'}}
        ]
    },
    {
        name: "Thursday",
        enabled: false,
        slots: [
            {start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'}}
        ]
    },
    {
        name: "Friday",
        enabled: false,
        slots: [
            {start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'}}
        ]
    },
    {
        name: "Saturday",
        enabled: false,
        slots: [
            {start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'}}
        ]
    },
]

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Kuwait'

export default function Onboarding() {
    const { user } = useLoaderData();
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [sendingData, setSendingData] = useState(false)
    // add successMessage
    const [successMessage, setSuccessMessage] = useState(false)

    // Set page title
    useEffect(() => {
        document.title = 'Onboarding';
        if (user.username) {
            setCurrentStepIndex(1);
            // Check if user has availability data and at least one day is enabled
            if (user.is_available) {
                let availabilityData = user.default_availability.data
                let enabledDays = 0;
                availabilityData.forEach((day) => {
                    if (day.enabled === true) {
                        enabledDays++;
                    }
                });
                if (enabledDays > 0) {
                    window.location.href = '/dashboard';
                }
            }
        }
    }, []);

    // Send data
    const sendData = (values) =>
        new Promise((resolve, reject) => {
            setSendingData(true);
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("timezone", values.timezone);
            formData.append("_method", 'put');

            axios
                .post("/api/me", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(function (response) {
                    setSendingData(false);
                    resolve();
                    if (response.data.data.id) {
                        //
                    }
                })
                .catch(function (error) {
                    setSendingData(false);
                    reject(error);
                });
        });

    // Submit form
    const onSubmit = async (values) => {
        try {
            await sendData(values);
            setCurrentStepIndex(1);
        } catch (error) {
            if (error.response.status === 422) {
                setSuccessMessage(error.response.data.errors.username[0]);
                // clear success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(false);
                }, 5000);
            }
        }
    };

    // Send data
    const sendStep2Data = (values) =>
        new Promise((resolve, reject) => {
            setSendingData(true);
            const formData = new FormData();
            formData.append("availability_data", JSON.stringify(values.data));
            formData.append("_method", 'put');

            axios
                .post("/api/me", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(function (response) {
                    setSendingData(false);
                    resolve();
                })
                .catch(function (error) {
                    setSendingData(false);
                    reject(error);
                });
        });

    // Submit form
    const onSubmitStep2 = async (values) => {
        try {
            await sendStep2Data(values);
            window.location.href = '/dashboard';
        } catch (error) {
            if (error.response.status === 422) {
                setSuccessMessage(error.response.data.errors.username[0]);
                // clear success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(false);
                }, 5000);
            }
        }
    };

    return (
        <AuthenticationLayout>
            <div>
                <AuthenticationLogo />
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">Welcome {user.name}</h2>
                <p className="mt-2 text-sm text-gray-600">
                    We take the work out of connecting with others so you can accomplish more.
                </p>
            </div>

            <div className="mt-8 ">
                <div>
                    <nav aria-label="Progress">
                        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                            {steps.map((step, stepIndex) => (
                            <li key={step.name} className="md:flex-1">
                                {stepIndex <= currentStepIndex ? (
                                <a
                                    onClick={() => { setCurrentStepIndex(stepIndex) }}
                                    className="cursor-pointer group flex flex-col border-l-4 border-grandkit-600 py-2 pl-4 hover:border-grandkit-800 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                                >
                                    <span className="text-sm font-medium text-grandkit-600 group-hover:text-grandkit-800">{step.id}</span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </a>
                                ) : (
                                <a
                                    onClick={() => { setCurrentStepIndex(stepIndex) }}
                                    className="cursor-pointer group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                                >
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{step.id}</span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </a>
                                )}
                            </li>
                            ))}
                        </ol>
                    </nav>
                    {successMessage && <div className="mt-6"><div className="text-sm text-red-600">{successMessage}</div></div>}
                </div>

                {currentStepIndex === 0 && <Form
                    keepDirtyOnReinitialize
                    onSubmit={onSubmit}
                    initialValues={{ username: user.username, timezone: timezone}}
                    //decorators={[focusOnError]}
                    render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                    return (
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* <button id="mainFormSubmit" type="submit"></button> */}
                            {/* return fail  */}
                            <div className="mt-6">
                                <div className="space-y-6">
                                    {/* {process.env.NODE_ENV === 'development' && <div>
                                        <pre>{JSON.stringify(values, 0, 2)}</pre>
                                    </div>} */}

                                    <Field name="username" validate={usernameValidator}>
                                        {({ input, meta }) => (
                                        <UsernameField required={true} label={"Create your URL"} helpText="Please ensure it contains only lowercase letters, numbers, and hyphens, with no spaces or special characters." prefix={"booking."+import.meta.env.VITE_APP_DOMAIN+"/"} input={input} meta={meta} col={6} />
                                        )}
                                    </Field>

                                    <div className="space-y-1">
                                        <Field name="timezone" validate={requiredValidator}>
                                            {({ input, meta }) => (
                                            <TimezoneSelectField required={true} label="Timezone" input={input} meta={meta} col={6} />
                                            )}
                                        </Field>
                                    </div>

                                    <div>
                                        <button type="submit"
                                            disabled={submitting || form.getState().error || form.getState().invalid || sendingData}
                                            className="flex w-full justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:bg-gray-600 disabled:opacity-70">
                                            {(submitting) ? 'Continuing..' : 'Continue'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                    </form>)}}
                />}

                {currentStepIndex === 1 && <Form
                    keepDirtyOnReinitialize
                    onSubmit={onSubmitStep2}
                    initialValues={{data: availabilityData}}
                    //decorators={[focusOnError]}
                    render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                    return (
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mt-6">
                                <div className="space-y-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Set your availability
                                        </label>
                                        <div>
                                            <Field name="data" validate={availabilityDataValidator}>
                                                {({ input, meta }) => (
                                                <AvailabilityField mode="mini" label="Change the start and end times of your day" input={input} meta={meta} col={6} />
                                                )}
                                            </Field>
                                        </div>
                                        <div className="text-sm italic text-gray-600 mt-6">
                                            Don't worry! You'll be able to further customize your availability later on.
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit"
                                            disabled={submitting || form.getState().error || form.getState().invalid || sendingData}
                                            className="flex w-full justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:bg-gray-600 disabled:opacity-70">

                                            {(submitting) ? 'Finishing..' : 'Finish'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </form>)}}
                />}
            </div>
        </AuthenticationLayout>
    )
}
