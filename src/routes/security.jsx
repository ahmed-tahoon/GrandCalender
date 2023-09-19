import { useEffect, useState } from "react";
import SideBar from "components/features/settings/SideBar";
import Tabs from "components/features/settings/Tabs";
import AppLayout from "layouts/AppLayout";
import { Field, Form } from "react-final-form";
import { Link, useLoaderData } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import PasswordField from "components/fields/PasswordField";

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

const requiredValidator = value => (value ? undefined : 'Required')

export default function Security() {
    const [sendingData, setSendingData] = useState(false);

    const { user } = useLoaderData();

    // Set page title
    useEffect(() => {
        document.title = 'Security';
    }, []);

    // Send data
    const sendData = (values) =>
        new Promise((resolve) => {
            setSendingData(true);
            const formData = new FormData();
            formData.append("old_password", values.old_password);
            formData.append("new_password", values.new_password);
            formData.append("new_password_confirmation", values.new_password_confirmation);
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
                    if (response.data.status === 'success') {
                        toast.success('Password updated successfully');
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
    };

    return (
        <AppLayout user={user} sideBar={<SideBar />}>
            <Tabs />

            <Form
                keepDirtyOnReinitialize
                onSubmit={onSubmit}
                initialValues={{}}
                //decorators={[focusOnError]}
                render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                return (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="space-y-6 mt-6">
                            <Field name="old_password" validate={requiredValidator}>
                                {({ input, meta }) => (            
                                <PasswordField required={true} label="Old password" input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="new_password" validate={requiredValidator}>
                                {({ input, meta }) => (            
                                <PasswordField required={true} label="New password" strengthBarEnabled={true} input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="new_password_confirmation" validate={requiredValidator}>
                                {({ input, meta }) => (            
                                <PasswordField required={true} label="Repeat new password" input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            {/* {process.env.NODE_ENV === 'development' && <div>
                                <pre>{JSON.stringify(values, 0, 2)}</pre>
                            </div>} */}
                        </div>

                        <div className="flex items-center justify-between mt-6 bg-gray-50 rounded-bl-lg rounded-br-lg -mx-6 -mb-6 px-4 py-3 text-right sm:px-6">
                            <div className="text-sm">
                                <Link to={'/reset-password'} className="font-medium text-grandkit-600 hover:text-grandkit-500">
                                    Forgot your password?
                                </Link>
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
            />
        </AppLayout>
    )
}