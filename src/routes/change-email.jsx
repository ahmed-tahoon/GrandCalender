import { useEffect, useState } from "react";
import SideBar from "components/features/settings/SideBar";
import Tabs from "components/features/settings/Tabs";
import AppLayout from "layouts/AppLayout";
import { Field, Form } from "react-final-form";
import { Link, useLoaderData } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import PasswordField from "components/fields/PasswordField";
import EmailField from "components/fields/EmailField";
import TextField from "components/fields/TextField";

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

const requiredValidator = value => (value ? undefined : 'Required')

const emailValidator = async function(value) {
    if(!value) {
        return 'Email is required'
    }

    if(!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        return 'Email is invalid'
    }

    const response = await axios.post('/api/check-email', {email: value});

    if(response.data.status === 'failed') {
        return response.data.message
    } else {
        return undefined
    }
}

export default function ChangeEmail() {
    const { user } = useLoaderData();
    const [sendingData, setSendingData] = useState(false);
    const [isShowOtpForm, setIsShowOtpForm] = useState(false);
    const [email, setEmail] = useState(null);
    const [currentEmail, setCurrentEmail] = useState(user.email);


    // Set page title
    useEffect(() => {
        document.title = 'Security';
    }, []);

    // Send data
    const sendData = (values) =>
        new Promise((resolve) => {
            setSendingData(true);
            const formData = new FormData();
            formData.append("new_email", values.new_email);

            axios
                .post("/api/change-email-request", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(function (response) {
                    setSendingData(false);
                    resolve();
                    if (response.data.status === 'success') {
                        setIsShowOtpForm(true)
                    }
                    if (response.data.status === 'error') {
                        toast.error(response.data.message);
                    }
                })
                .catch(function (error) {
                    setSendingData(false);
                    toast.error(error.message);
                    resolve();
                });
        });

    // Submit form
    const onSubmit = async (values) => {
        await sendData(values);
        setEmail(values.new_email);
    };

    // Send data
    const sendOtpData = (values) =>
        new Promise((resolve) => {
            setSendingData(true);
            const formData = new FormData();
            formData.append("email", email);
            formData.append("old_email_otp", values.old_email_otp);
            formData.append("otp", values.otp);

            axios
                .post("/api/change-email-confirm", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(function (response) {
                    setSendingData(false);
                    resolve();
                    if (response.data.status === 'success') {
                        toast.success(response.data.message);
                        setCurrentEmail(email);
                    }
                    if (response.data.status === 'error') {
                        toast.error(response.data.message);
                    }
                })
                .catch(function (error) {
                    setSendingData(false);
                    toast.error(error.message);
                    resolve();
                });
        });

    // Submit form
    const onOtpSubmit = async (values) => {
        await sendOtpData(values);
        setIsShowOtpForm(false);
    };

    return (
        <AppLayout user={user} sideBar={<SideBar />}>
            <Tabs />

            {!isShowOtpForm && <Form
                keepDirtyOnReinitialize
                onSubmit={onSubmit}
                initialValues={{}}
                render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                return (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="space-y-6 mt-6">
                            <div className={'sm:col-span-6'}>
                                <label className="block text-sm font-medium text-gray-700">
                                    Current Email
                                </label>
                                <div className="mt-1 relative text-sm">
                                    {currentEmail}
                                </div>
                            </div>

                            <Field name="new_email" validate={emailValidator}>
                                {({ input, meta }) => (
                                <EmailField required={true} autoComplete="" label="New email" input={input} meta={meta} col={6} />
                                )}
                            </Field>
                        </div>

                        <div className="flex items-center justify-between mt-6 bg-gray-50 rounded-bl-lg rounded-br-lg -mx-6 -mb-6 px-4 py-3 text-right sm:px-6">
                            <div className="text-sm">

                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
                            >
                                {(submitting) ? 'Saving..' : 'Save'}
                            </button>
                        </div>
                    </form>
                )}}
            />}

            {isShowOtpForm && <Form
                onSubmit={onOtpSubmit}
                initialValues={{}}
                render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                return (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="space-y-6 mt-6">
                            <div>
                                <p className="mt-2 text-sm text-gray-600">
                                To complete your email change request, please enter the One-Time Passwords (OTPs) that were sent to your old email address <span className="font-medium text-black">{currentEmail} </span> & new email address <span className="font-medium text-black">{email}</span>
                                </p>
                                <p className="mt-2 text-sm text-gray-600">
                                If you did not receive the OTPs <span className="font-medium text-black">within 15 minutes</span>, please click on <button onClick={() => setIsShowOtpForm(false)} className="font-medium text-grandkit-600 hover:text-grandkit-500">
                                    request again
                                    </button> to request a new one.
                                </p>
                            </div>

                            <Field name="old_email_otp" validate={requiredValidator}>
                                {({ input, meta }) => (
                                <TextField required={true} label="Old email OTP" placeholder="Enter old email OTP here" input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="otp" validate={requiredValidator}>
                                {({ input, meta }) => (
                                <TextField required={true} label="New email OTP" placeholder="Enter new email OTP here" input={input} meta={meta} col={6} />
                                )}
                            </Field>
                        </div>

                        <div className="flex items-center justify-between mt-6 bg-gray-50 rounded-bl-lg rounded-br-lg -mx-6 -mb-6 px-4 py-3 text-right sm:px-6">
                            <div className="text-sm">

                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
                            >
                                {(submitting) ? 'Confirming..' : 'Confirm'}
                            </button>
                        </div>
                    </form>
                )}}
            />}
        </AppLayout>
    )
}
