import { useEffect, useState } from "react";
import SideBar from "components/features/settings/SideBar";
import Tabs from "components/features/settings/Tabs";
import TextField from "components/fields/TextField";
import TimezoneSelectField from "components/fields/TimezoneSelectField";
import AppLayout from "layouts/AppLayout";
import { Field, Form } from "react-final-form";
import UsernameField from "components/fields/UsernameField";
import { useLoaderData, useRevalidator } from "react-router-dom";
import MultiLanguageSelectField from "components/fields/MultiLanguageSelectField";
import axios from 'axios';
import { toast } from 'react-toastify';
import AddressField from "components/fields/AddressField";
import AvatarField from "components/fields/AvatarField";
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import TextareaField from "components/fields/TextareaField";

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

const arrayRequiredValidator = value => (value.length ? undefined : 'Required')
const requiredValidator = value => (value ? undefined : 'Required')
const usernameValidator = async function(value) {
    if(!value) {
        return 'Please enter a url'
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

export default function Profile() {
    const [sendingData, setSendingData] = useState(false);
    const { user } = useLoaderData();
    let revalidator = useRevalidator();

    // Set page title
    useEffect(() => {
        document.title = 'Your Profile';
    }, []);

    // Send data
    const sendData = (values) =>
        new Promise((resolve) => {
            setSendingData(true);
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("name", values.name);
            if(values.title) formData.append("title", values.title);
            if(values.description) formData.append("description", values.description);
            formData.append("timezone", values.timezone);
            formData.append("languages", JSON.stringify(values.languages));
            if(values.profile_photo_url) formData.append("profile_photo_url", values.profile_photo_url);
            formData.append("profile_form", 'yes');
            formData.append("billing_address", values.address.address ? values.address.address : '');
            formData.append("billing_city", values.address.city ? values.address.city : '');
            formData.append("billing_region", values.address.region ? values.address.region : '');
            formData.append("billing_country", values.address.country ? values.address.country : '');
            formData.append("billing_zipcode", values.address.zipcode ? values.address.zipcode : '');
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
                        revalidator.revalidate();
                        toast.success('Profile updated successfully');
                    }
                })
                .catch(function (error) {
                    setSendingData(false);
                    console.log(error)
                    if (error.response.status === 422) {
                        error.response.data.errors.profile_photo_url && toast.error(error.response.data.errors.profile_photo_url[0]);
                    }
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

            {/* <div>
                <pre>{JSON.stringify(user, 0, 2)}</pre>
            </div> */}

            <Form
                keepDirtyOnReinitialize
                onSubmit={onSubmit}
                initialValues={{...user, address: {
                    address: user.billing_address,
                    city: user.billing_city,
                    region: user.billing_region,
                    country: user.billing_country,
                    zipcode: user.billing_zipcode,
                }}}
                //decorators={[focusOnError]}
                render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                return (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="space-y-6 mt-6">
                            <Field name="profile_photo_url">
                                {({ input, meta }) => (
                                <AvatarField label="Avatar" accept=".png,.jpg,.jpeg, maximun size 1024kb" input={input} meta={meta} user={user} />
                                )}
                            </Field>

                            <Field name="username" validate={usernameValidator}>
                                {({ input, meta }) => (
                                <UsernameField required={true} label={"Your "+import.meta.env.VITE_APP_NAME+" URL"} helpText="Updating the root URL will make old URLs not accessable, except anonymous URLs" prefix={"booking."+import.meta.env.VITE_APP_DOMAIN+"/"} input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="name" validate={requiredValidator}>
                                {({ input, meta }) => (
                                <TextField required={true} label="Full Name" placeholder="Enter your full name" input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="title">
                                {({ input, meta }) => (
                                <TextField label="Title" placeholder="Enter your title" input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="description">
                                {({ input, meta }) => (
                                    <TextareaField label="Description" placeholder='Default: "Welcome to my scheduling page. Please follow the instructions to add an event to my calendar."' input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="languages" validate={arrayRequiredValidator}>
                                {({ input, meta }) => (
                                <MultiLanguageSelectField required={true} isMulti={true} label="Available languages" helpText="Inputs will have tabs for each language" input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="timezone">
                                {({ input, meta }) => (
                                <TimezoneSelectField label="Timezone" input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            <Field name="address">
                                {({ input, meta }) => (
                                <AddressField label="Billing Address" input={input} meta={meta} col={6} />
                                )}
                            </Field>

                            {/* {process.env.NODE_ENV === 'development' && <div>
                                <pre>{JSON.stringify(values, 0, 2)}</pre>
                            </div>} */}
                        </div>

                        <div className="mt-6 bg-gray-50 rounded-bl-lg rounded-br-lg -mx-6 -mb-6 px-4 py-3 text-right sm:px-6">
                            <button
                                disabled={submitting || form.getState().error || form.getState().invalid || sendingData}
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:bg-gray-600 disabled:opacity-70"
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
