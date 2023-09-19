import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Field, Form } from 'react-final-form'
import axios from 'axios';
import SelectField from '../SelectFieldLocation'
import TextField from '../TextField'
import { useLoaderData } from "react-router-dom";

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}
const requiredValidator = value => (value ? undefined : 'Required')
const urlValidator = value => {
    if(!value) return 'URL is required';

    if(value.substring(0, 7) === 'http://' || value.substring(0, 8) === 'https://') {
        return undefined
    } else {
        return 'Please enter a valid URL'
    }
}

export default function LocationFieldModal({edittingField, edittingFieldIndex, open, close, onAddField, onSaveField, fields}) {
    const { user } = useLoaderData();
  const actionButtonRef = useRef(null)

    // pluck type.value from fields
    const fieldTypes = fields.map(field => {
        return field.kind;
    });

    const checkGoogleMeet = user.providers.find(provider => provider.provider === 'google' && provider.meeting_type === 'google_meet');
    const checkZoom = user.providers.find(provider => provider.provider === 'zoom' && provider.meeting_type === 'zoom');
    const checkHasZoom = user.providers.some(provider => provider.provider === 'zoom' && provider.meeting_type === 'zoom');
    const checkHasGoogleMeet = user.providers.some(provider => provider.provider === 'google' && provider.meeting_type === 'google_meet');
    const checkGoogleCalendar = user.providers.some(provider => provider.provider === 'google');
    console.log(checkZoom)
    const options = [
        { kind: 'location', name: 'In-person meeting' },
        { kind: 'link', name: 'Meeting link' },
        { kind: 'outbound_call', name: `I will call my invitee` },
        { kind: 'inbound_call', name: 'My invitee will call me' },
        ...(checkGoogleMeet ? [{ kind: 'google_meet', name: 'Google Meet' }] : []),
        ...(checkZoom ? [{ kind: 'zoom', name: 'Zoom Meeting' }] : [])
    ].filter(option => {
        let condition = true; // Default to true if no condition matches
    
        if ((fieldTypes.includes('inbound_call') || fieldTypes.includes('outbound_call'))) {
            condition = condition && (option.kind !== 'inbound_call' && option.kind !== 'outbound_call');
        }
    
        // Hide Google Meet if user already connected
        if (fieldTypes.includes('google_meet') && checkHasGoogleMeet) {
            condition = condition && (option.kind !== 'google_meet');
        }
    
        // Hide Zoom if user already connected
        if (fieldTypes.includes('zoom') && checkHasZoom) {
            condition = condition && (option.kind !== 'zoom');
        }
    
        return condition;
    });
    
  // Submit form
    const onSubmit = (values) => {
        // {
    //     "kind": 474961332,
    //     "kind": "inbound_call", // inbound_call, outbound_call, location, link, conference
    //     "position": 2,
    //     "location": null,
    //     "phone_number": "+20 111 198 1716",
    //     "additional_info": "",
    //     "conferencing_configured": false
    // }
        const payload = {
            // generate random string for id
            id: edittingField ? edittingField.id : null,
            kind: values.kind,
            // start from 0
            position: edittingFieldIndex ?? fields.length,
            location: values.location ?? '',
            phone_number: values.kind === 'inbound_call' ? values.phone_number : '',
            link: values.link ?? '',
            additional_info: '',
            conferencing_configured: values.kind === 'google_meet' || values.kind === 'zoom' ? true : false,
        }
      if(edittingField) {
        onSaveField(payload, edittingFieldIndex);
      } else {
        onAddField(payload);
      }
  };


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={actionButtonRef} onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="">
                    <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900">
                      Add new location
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-center ">

                      </p>

                      <Form
                        keepDirtyOnReinitialize
                        onSubmit={onSubmit}
                        initialValues={edittingField ? edittingField : {kind: 'location', name: 'In-person meeting'}}
                        //decorators={[focusOnError]}
                        render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                            return (
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="space-y-3 mt-6">
                                        <Field name="kind" validate={requiredValidator}>
                                            {({ input, meta }) => (
                                              <SelectField required={true} options={options} label="Location Type" input={input} meta={meta} col={6} />
                                            )}
                                        </Field>

                                        {values.kind === 'location' && <Field name="location" validate={requiredValidator}>
                                            {({ input, meta }) => (
                                                <TextField required={true} label="Set an address or place" placeholder="Enter address" input={input} meta={meta} col={6} />
                                            )}
                                        </Field>}

                                        {values.kind === 'link' && <Field name="link" validate={urlValidator}>
                                            {({ input, meta }) => (
                                                <TextField required={true} label="Set a link to the meeting" placeholder="https://" input={input} meta={meta} col={6} />
                                            )}
                                        </Field>}

                                        {values.kind === 'outbound_call' && <div className="py-3 text-gray-600 text-sm">System will ask your invitee to enter a phone number before scheduling.</div>}

                                        {values.kind === 'inbound_call' && <Field name="phone_number" validate={requiredValidator}>
                                            {({ input, meta }) => (
                                                <TextField required={true} label="Your phone number" placeholder="Enter phone number" input={input} meta={meta} col={6} />
                                            )}
                                        </Field>}

                                        {/* {process.env.NODE_ENV === 'development' && <div>
                                            <pre>{JSON.stringify(values, 0, 2)}</pre>
                                        </div>} */}
                                    </div>



                                    <div className="mt-8 sm:mt-8 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 ">
                                        <button
                                            disabled={submitting}
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-grandkit-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        >
                                            {(submitting) ? 'Saving..' : 'Save'}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                            onClick={() => close()}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}}
                        />
                    </div>
                  </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
