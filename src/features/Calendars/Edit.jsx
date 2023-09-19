import { useEffect, useState } from "react";
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Field, Form } from "react-final-form";
import TextField from "components/fields/TextField";
import CalendarUrlField from "components/fields/CalendarUrlField";
import TextareaField from "components/fields/TextareaField";
import SelectField from "components/fields/SelectField";
import ToggleField from "components/fields/ToggleField";
import ColorSelectField from "components/fields/ColorSelectField";
import SingleFileUploadField from "components/fields/SingleFileUploadField";
import NumberField from "components/fields/NumberField";
import DataSelectField from "components/fields/DataSelectField";
import InviteesField from "components/fields/InviteesField";
import InviteesScheduleField from "components/fields/InviteesScheduleField";
import BufferTimeField from "components/fields/BufferTimeField";
import AddtionalQuestionsField from "components/fields/AddtionalQuestionsField";
import LocationField from "components/fields/LocationField";
import { toast } from "react-toastify";
import axios from "axios";
import createDecorator from "final-form-focus";
import Loader from "components/layout/Loader";

// Create Decorator
const focusOnErrors = createDecorator();

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.baseURL = apiEndpoint;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

const requiredValidator = (value) => (value ? undefined : "Required");

const urlValidator = (value) => {
    if (!value) return undefined;

    if (
        value.substring(0, 7) === "http://" ||
        value.substring(0, 8) === "https://"
    ) {
        return undefined;
    } else {
        return "Please enter a valid URL";
    }
};

export default function CalendarsEdit() {
    const { user } = useLoaderData();
    const [isLoaded, setIsLoaded] = useState(false);
    let navigate = useNavigate();
    let params = useParams();
    const [error, setError] = useState(null);
    const [model, setModel] = useState({});

    // Set page title
    useEffect(() => {
        document.title = "Edit Calendar";
    }, []);

    function reloadData() {
        axios
            .get("/api/calendars/" + params.modelId)
            .then(function (response) {
                // handle success
                if (response.data.status === "no_permission") {
                    //setIsNoPermission(true)
                } else {
                    if (response.data) {
                        const modelData = response.data.data;
                        document.title = "Edit Calendar: " + modelData.name;
                        // replace duration with duration_calendar
                        modelData.duration_calendar = modelData.duration;
                        console.log(modelData);
                        setModel(modelData);
                        setIsLoaded(true);
                    }
                }
            })
            .catch(function (error) {
                // handle error
                //setIsLoaded(true);
                setError(error);
                //setIsLoaded(true);
            })
            .then(function () {
                //setIsLoaded(true);
            });
    }

    useEffect(() => {
        reloadData();
    }, []);

    const calendarUrlValidator = async function (value) {
        if (!value) {
            return "Please enter a URL for your calendar";
        }

        // slug url validation no space and no special characters except dash regex
        const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!regex.test(value)) {
            return "The URL format is invalid. Please use only lowercase letters (a-z), numbers, and hyphens.";
        }

        try {
            const response = await axios.post("/api/check-calendar-slug", {
                slug: value,
                id: model.id,
            });
            return false;
        } catch (error) {
            if (error.response.status === 422) {
                return error.response.data.errors.slug[0];
            }
        }
    };

    // Send data
    const sendData = (values) =>
        new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("_method", "put");
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("availability_id", values.availability.id);
            if (values.welcome_message) {
                formData.append("welcome_message", values.welcome_message);
            }
            if (values.locations) {
                formData.append("locations", JSON.stringify(values.locations));
            }
            formData.append(
                "disable_guests",
                values.disable_guests ? "yes" : "no"
            );
            formData.append(
                "requires_confirmation",
                values.requires_confirmation ? "yes" : "no"
            );
            formData.append(
                "is_show_on_booking_page",
                values.is_show_on_booking_page ? "yes" : "no"
            );
            formData.append("is_isolate", values.is_isolate ? "yes" : "no");
            if (values.redirect_on_booking) {
                formData.append(
                    "redirect_on_booking",
                    values.redirect_on_booking
                );
            }
            if (values.invitees_emails) {
                formData.append(
                    "invitees_emails",
                    JSON.stringify(values.invitees_emails)
                );
            }
            formData.append(
                "enable_signup_form_after_booking",
                values.enable_signup_form_after_booking ? "yes" : "no"
            );
            if (values.color) {
                formData.append("color", values.color);
            }
            if (values.time_slots_intervals) {
                formData.append(
                    "time_slots_intervals",
                    timeSlotsIntervalsMinutes(values)
                );

                if (values.time_slots_intervals.id === "custom") {
                    formData.append(
                        "time_slots_intervals_type",
                        values.time_slots_intervals_type.id
                    );

                    formData.append(
                        "time_slots_intervals_number",
                        values.time_slots_intervals_number
                    );
                }
            }

            if (values.duration_calendar) {
                formData.append("duration_calendar", durationMinutes(values));

                if (values.duration_calendar.id === "custom") {
                    formData.append(
                        "duration_type",
                        values.duration_type.id
                    );

                    formData.append(
                        "duration_number",
                        values.duration_number
                    );
                }
            }
            if (values.invitees_can_schedule) {
                formData.append(
                    "invitees_can_schedule",
                    JSON.stringify(values.invitees_can_schedule)
                );
            }
            if (values.buffer_time) {
                formData.append(
                    "buffer_time",
                    JSON.stringify(values.buffer_time)
                );
            }
            if (values.additional_questions) {
                formData.append(
                    "additional_questions",
                    JSON.stringify(values.additional_questions)
                );
            }
            if (values.cover_url) {
                formData.append("cover_url", values.cover_url);
            }

            axios
                .post("/api/calendars/" + params.modelId, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    },
                })
                .then(function (response) {
                    resolve();
                    if (response.data.status === "success") {
                        toast.success("Calendar updated successfully");
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });

    // Submit form
    const onSubmit = async (values) => {
        try {
            await sendData(values);
            // navigate send to calendars page toast msg
            setTimeout(() => {
                navigate("/dashboard/calendars");
            }, 1500);
        } catch (error) {
            if (error.response.status === 422) {
                setError(error.response.data.errors);

                // display error
                toast.error("Please check the form for errors");
            }
        }
    };

    const timeSlotsIntervalsMinutes = (values) => {
        if (values.time_slots_intervals.id === "custom") {
            if (values.time_slots_intervals_type.id === "hrs") {
                return values.time_slots_intervals_number * 60;
            }

            return values.time_slots_intervals_number;
        }

        return values.time_slots_intervals.id;
    }

    const durationMinutes = (values) => {
        if (values.duration_calendar.id === "custom") {
            if (values.duration_type.id === "hrs") {
                return values.duration_number * 60;
            }

            return values.duration_number;
        }

        return values.duration_calendar.id;
    }

    if (!isLoaded) return <Loader />;

    return (
        <AppLayout
            user={user}
            layoutType="many_left_blocks"
            sideBar={<SideBar />}
        >
            {isLoaded && (
                <Form
                    keepDirtyOnReinitialize
                    onSubmit={onSubmit}
                    // time_slots_intervals: { id: 15, name: "15 minutes" },
                    // time_slots_intervals_type: { id: "min", name: "min" },
                    // duration: { id: 15, name: "15 minutes" },
                    // duration_type: { id: "min", name: "min" },
                    initialValues={model}
                    decorators={[focusOnErrors]}
                    render={({
                        handleSubmit,
                        form,
                        submitting,
                        pristine,
                        values,
                        submitFailed,
                    }) => {
                        return (
                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                            >
                                <div className="rounded-lg bg-white shadow">
                                    <div className="p-6">
                                        <h2 className="text-base font-semibold text-gray-900 mb-6 uppercase">
                                            General information
                                        </h2>

                                        <div className="space-y-6">
                                            <Field
                                                name="name"
                                                validate={requiredValidator}
                                            >
                                                {({ input, meta }) => (
                                                    <TextField
                                                        required={true}
                                                        label="Name"
                                                        placeholder="Enter name"
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field
                                                name="slug"
                                                validate={calendarUrlValidator}
                                            >
                                                {({ input, meta }) => (
                                                    <CalendarUrlField
                                                        required={true}
                                                        label={
                                                            "Your calendar URL"
                                                        }
                                                        helpText="Please ensure it contains only lowercase letters, numbers, and hyphens, with no spaces or special characters."
                                                        prefix={
                                                            "booking." +
                                                            import.meta.env
                                                                .VITE_APP_DOMAIN +
                                                            "/" +
                                                            user.username +
                                                            "/"
                                                        }
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="welcome_message">
                                                {({ input, meta }) => (
                                                    <TextareaField
                                                        label="Welcome message"
                                                        placeholder="Enter welcome message"
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="locations">
                                                {({ input, meta }) => (
                                                    <LocationField
                                                        label="Locations"
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field
                                                name="redirect_on_booking"
                                                validate={urlValidator}
                                            >
                                                {({ input, meta }) => (
                                                    <TextField
                                                        label="Redirect on booking"
                                                        description="Add URL in where you want invitees to be redirected after booking."
                                                        placeholder="http://"
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="invitees_emails">
                                                {({ input, meta }) => (
                                                    <InviteesField
                                                        label="Invitees Emails"
                                                        col={6}
                                                        input={input}
                                                        meta={meta}
                                                        description={`Invitess will receive email with private link to see information.`}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="color">
                                                {({ input, meta }) => (
                                                    <ColorSelectField
                                                        label="Calendar Color"
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="is_isolate">
                                                {({ input, meta }) => (
                                                    <ToggleField
                                                        hasTopPadding={false}
                                                        label="Isolate"
                                                        subLabel="Toggle isolate this calendar bookings from others."
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="is_show_on_booking_page">
                                                {({ input, meta }) => (
                                                    <ToggleField
                                                        hasTopPadding={false}
                                                        label="Show on my front page"
                                                        subLabel="Toggle above if you want this calendar to be listed within your front-end page."
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="enable_signup_form_after_booking">
                                                {({ input, meta }) => (
                                                    <ToggleField
                                                        hasTopPadding={false}
                                                        label="Show signup form after booking"
                                                        subLabel="Allow invitees to signup on GrandCalendar after booking."
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="disable_guests">
                                                {({ input, meta }) => (
                                                    <ToggleField
                                                        hasTopPadding={false}
                                                        label="Disable Guests"
                                                        subLabel="Disable adding additional guests while booking."
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="requires_confirmation">
                                                {({ input, meta }) => (
                                                    <ToggleField
                                                        hasTopPadding={false}
                                                        label="Requires confirmation"
                                                        subLabel="The booking needs to be manually confirmed before it is pushed to the integrations and a confirmation mail is sent."
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-white shadow mt-6">
                                    <div className="p-6">
                                        <h2 className="text-base font-semibold text-gray-900 mb-6 uppercase">
                                            Time settings
                                        </h2>

                                        <div className="space-y-6">
                                            <Field name="availability">
                                                {({ input, meta }) => (
                                                    <DataSelectField
                                                        path={
                                                            "/api/availabilities"
                                                        }
                                                        label="Choose Calendar Availability"
                                                        col={6}
                                                        input={input}
                                                        meta={meta}
                                                        description='You can manage your availabilities from "Availability" screen.'
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="time_slots_intervals">
                                                {({ input, meta }) => (
                                                    <SelectField
                                                        serverError={error}
                                                        required={true}
                                                        options={[
                                                            {
                                                                id: 15,
                                                                name: "15 minutes",
                                                            },
                                                            {
                                                                id: 30,
                                                                name: "30 minutes",
                                                            },
                                                            {
                                                                id: 60,
                                                                name: "60 minutes",
                                                            },
                                                            {
                                                                id: "custom",
                                                                name: "Custom",
                                                            },
                                                        ]}
                                                        label="Time Slots Intervals"
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        description="This field allows you to set the length of time between two consecutive starting points of events or appointments. For example, if you set the interval to 30 minutes, an appointments can be scheduled at 9:00 am, 9:30 am, 10:00 am, and so on."
                                                    />
                                                )}
                                            </Field>

                                            {values?.time_slots_intervals?.id ===
                                            "custom" && (
                                            <div
                                                className="grid gap-4 grid-cols-3"
                                                style={{
                                                    marginTop: "8px",
                                                }}
                                            >
                                                <Field name="time_slots_intervals_number">
                                                    {({ input, meta }) => (
                                                        <NumberField
                                                            input={input}
                                                            meta={meta}
                                                            col={2}
                                                            serverError={error}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="time_slots_intervals_type">
                                                    {({ input, meta }) => (
                                                        <SelectField
                                                            options={[
                                                                {
                                                                    id: "min",
                                                                    name: "min",
                                                                },
                                                                {
                                                                    id: "hrs",
                                                                    name: "hrs",
                                                                },
                                                            ]}
                                                            input={input}
                                                            meta={meta}
                                                            col={1}
                                                            serverError={error}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                            )}

                                            <Field
                                                name="duration_calendar"
                                                validate={requiredValidator}
                                            >
                                                {({ input, meta }) => (
                                                    <SelectField
                                                        required={true}
                                                        options={[
                                                            {
                                                                id: 15,
                                                                name: "15 minutes",
                                                            },
                                                            {
                                                                id: 30,
                                                                name: "30 minutes",
                                                            },
                                                            {
                                                                id: 60,
                                                                name: "60 minutes",
                                                            },
                                                            {
                                                                id: "custom",
                                                                name: "Custom",
                                                            },
                                                        ]}
                                                        label="Duration"
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        description={`This field allows you to specify the length of time that an event or appointment will take. For example, if you have a meeting that will take one hour, you can input "60 minutes" as the duration.`}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            {values?.duration_calendar?.id ===
                                            "custom" && (
                                            <div
                                                className="grid gap-4 grid-cols-3"
                                                style={{
                                                    marginTop: "8px",
                                                }}
                                            >
                                                <Field name="duration_number">
                                                    {({ input, meta }) => (
                                                        <NumberField
                                                            input={input}
                                                            meta={meta}
                                                            col={2}
                                                            serverError={error}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="duration_type">
                                                    {({ input, meta }) => (
                                                        <SelectField
                                                            options={[
                                                                {
                                                                    id: "min",
                                                                    name: "min",
                                                                },
                                                                {
                                                                    id: "hrs",
                                                                    name: "hrs",
                                                                },
                                                            ]}
                                                            value={{
                                                                id: "min",
                                                                name: "min",
                                                            }}
                                                            input={input}
                                                            meta={meta}
                                                            col={1}
                                                            serverError={error}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                        )}

                                            <Field name="invitees_can_schedule">
                                                {({ input, meta }) => (
                                                    <InviteesScheduleField
                                                        label="Invitees can schedule"
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                        serverError={error}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="buffer_time">
                                                {({ input, meta }) => (
                                                    <BufferTimeField
                                                        label="Buffer time"
                                                        description="Buffer time is the extra time added to your booking slot to allow for preparation between appointments. This can be useful to ensure that you have enough time to prepare for your next appointment or to allow for unexpected delays."
                                                        serverError={error}
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-white shadow mt-6">
                                    <div className="p-6">
                                        <h2 className="text-base font-semibold text-gray-900 mb-6 uppercase">
                                            Additional Questions
                                        </h2>

                                        <div className="space-y-6 pb-6">
                                            <Field name="additional_questions">
                                                {({ input, meta }) => (
                                                    <AddtionalQuestionsField
                                                        label=""
                                                        serverError={error}
                                                        input={input}
                                                        meta={meta}
                                                        col={6}
                                                    />
                                                )}
                                            </Field>

                                            {process.env.NODE_ENV ===
                                                "development" && (
                                                <div>
                                                    <pre>
                                                        {JSON.stringify(
                                                            values,
                                                            0,
                                                            2
                                                        )}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-18 shadow-lg shadow-black fixed bottom-0 left-0 right-0 bg-gray-50 first-letter:text-right">
                                            <div className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-2 flex justify-between items-center py-2">
                                                <Link
                                                    to="/dashboard"
                                                    type="submit"
                                                    className="inline-flex mr-4 justify-center rounded-md border bg-white py-2 px-4 text-sm font-medium text-gray-900 shadow-sm border-gray-300 hover:bg-gray-50 disabled:opacity-70"
                                                >
                                                    Back
                                                </Link>

                                                <button
                                                    disabled={submitting}
                                                    type="submit"
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:opacity-70"
                                                >
                                                    {submitting
                                                        ? "Saving.."
                                                        : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                />
            )}
        </AppLayout>
    );
}
