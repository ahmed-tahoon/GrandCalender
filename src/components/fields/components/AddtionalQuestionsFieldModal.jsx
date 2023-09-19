import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Field, Form } from 'react-final-form'
import axios from 'axios';
import SelectField from '../SelectField'
import TextField from '../TextField'
import ToggleField from '../ToggleField'

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

const requiredValidator = value => (value ? undefined : 'Required')

export default function AddtionalQuestionsFieldModal({edittingField, edittingFieldIndex, open, close, onAddField, onSaveField}) {

  const actionButtonRef = useRef(null)

  // Submit form
  const onSubmit = (values) => {
      if(edittingField) {
        onSaveField(values, edittingFieldIndex);
      } else {
        onAddField(values);
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="">
                    <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900">
                      Add new question
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-center ">
                        This question will be shown when booking this calendar
                      </p>

                      <Form
                        keepDirtyOnReinitialize
                        onSubmit={onSubmit}
                        initialValues={edittingField ? edittingField : {type: {id: 'text', name: 'Text'}}}
                        //decorators={[focusOnError]}
                        render={({ handleSubmit, form, submitting, pristine, values, submitFailed }) => {
                            return (
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="space-y-3 mt-6">
                                        <Field name="type" validate={requiredValidator}>
                                            {({ input, meta }) => (            
                                              <SelectField required={true} options={[
                                                {id: 'text', name: 'Text'},
                                                {id: 'textarea', name: 'Multiline text'},
                                                {id: 'number', name: 'Number'},
                                                {id: 'boolean', name: 'Checkbox'},
                                              ]} label="Question Field Type" input={input} meta={meta} col={6} />
                                            )}
                                        </Field>

                                        <Field name="label" validate={requiredValidator}>
                                            {({ input, meta }) => (            
                                                <TextField required={true} label="Question Name" placeholder="Enter label" input={input} meta={meta} col={6} />
                                            )}
                                        </Field>

                                        {values.type.id !== 'boolean' && <Field name="placeholder">
                                            {({ input, meta }) => (            
                                                <TextField label="Placeholder" placeholder="Enter placeholder" input={input} meta={meta} col={6} />
                                            )}
                                        </Field>}

                                        {values.type.id !== 'boolean' && <Field name="is_required">
                                            {({ input, meta }) => (            
                                                <ToggleField hasTopPadding={false} label="Required Field?" input={input} meta={meta} col={6} />
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
                                            {(submitting) ? 'Saving..' : 'Save field'}
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
