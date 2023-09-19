import { ArrowDownIcon, ArrowUpIcon, DocumentDuplicateIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react'
import AddtionalQuestionsFieldModal from './components/AddtionalQuestionsFieldModal';

export default function AddtionalQuestionsField(props) {
    const { label, input, meta, placeholder = '', col = 3, required = false, serverError = null } = props
    const [isShowModal, setIsShowModal] = useState(false);
    const [fields, setFields] = useState(Array.isArray(input.value) ? input.value : []);
    const [edittingField, setEdittingField] = useState(undefined);
    const [edittingFieldIndex, setEdittingFieldIndex] = useState(undefined);

    useEffect(() => {
        input.onChange(fields)
    }, [fields]);

    function onAddField(values) {
        let newField = {
            type: values.type,
            label: values.label,
            placeholder: values.placeholder,
            is_required: values.is_required,
        }
        let newFields = fields.slice();
        newFields.push(newField)
        setFields(newFields)
        closeModal();
    }

    function onSaveField(values, index) {
        let newFields = fields.slice();
        newFields[index] = values;
        setFields(newFields);
        closeModal();
    }

    function deleteField(index) {
        let newFields = fields.slice();
        newFields.splice(index, 1)
        setFields(newFields)
    }

    function editField(index) {
        let field = JSON.parse(JSON.stringify(fields[index]));
        setEdittingField(field)
        setEdittingFieldIndex(index);
        setIsShowModal(true)
    }

    function duplicateField(index) {
        let field = JSON.parse(JSON.stringify(fields[index]));
        let newFields = fields.slice();
        newFields.push(field)
        setFields(newFields)
    }

    function closeModal() {
        setEdittingField(undefined)
        setEdittingFieldIndex(undefined);
        setIsShowModal(false)
    }

    function moveElement(array, fromIndex, toIndex) {
        let arrayCopy = [...array];
        const element = arrayCopy.splice(fromIndex, 1)[0];
        arrayCopy.splice(toIndex, 0, element);
        return arrayCopy;
      }

    function moveUp(index) {
        let newFields = fields.slice();
        newFields = moveElement(newFields, index, index-1)
        setFields(newFields)
    }

    function moveDown(index) {
        let newFields = fields.slice();
        newFields = moveElement(newFields, index, index+1)
        setFields(newFields)
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className="mt-1 relative">
                {fields.map((field, index) => (<div key={index} className="mb-2 relative border text-xs shadow-sm rounded-md p-2 space-y-1">
                    <div className="flex justify-start mr-40 space-x-3">
                    <div>
                        <div className="font-medium mr-2">Question Field Type</div>
                        {field.type.name}
                    </div>
                    <div>
                        <div className="font-medium mr-2">Question Name</div>
                        {field.label}
                    </div>
                    {field.placeholder && field.type.id !== 'boolean' && <div>
                        <div className="font-medium mr-2">Placeholder</div>
                        {field.placeholder}
                    </div>}
                    {field.type.id !== 'boolean' && <div>
                        <div className="font-medium mr-2">Required Field</div>
                        {field.is_required ? 'Yes' : 'No'}
                    </div>}
                    </div>

                    <div className="absolute right-2 bottom-2 top-2 space-x-1 flex justify-between items-center">
                        {index > 0 && <button className="g-icon-btn" onClick={() => moveUp(index)}><ArrowUpIcon className="h-4 w-4" aria-hidden="true" /></button>}
                        {index < (fields.length - 1) && <button className="g-icon-btn" onClick={() => moveDown(index)}><ArrowDownIcon className="h-4 w-4" aria-hidden="true" /></button>}
                        <button className="g-icon-btn" onClick={() => editField(index)}><PencilIcon className="h-4 w-4" aria-hidden="true" /></button>
                        <button className="g-icon-btn" onClick={() => duplicateField(index)}><DocumentDuplicateIcon className="h-4 w-4" aria-hidden="true" /></button>
                        <button className="g-icon-btn" onClick={() => deleteField(index)}><TrashIcon className="h-4 w-4" aria-hidden="true" /></button>
                    </div>
                </div>))}

                {fields.length === 0 && <div className="mb-2 relative border text-sm shadow-sm rounded-md p-8 text-center space-y-1 text-gray-600">No field</div>}

                <button className="g-default-btn-sm inine-flex items-center gap-x-1.5" onClick={() => setIsShowModal(true)} type="button">
                    <span>Add field</span>
                    <PlusIcon className="-mr-0.5 h-4 w-4" aria-hidden="true" />
                </button>

            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
            {serverError && serverError[input.name] && <div className="mt-2 text-sm text-red-800">{serverError[input.name][0]}</div>}

            <AddtionalQuestionsFieldModal edittingField={edittingField} edittingFieldIndex={edittingFieldIndex} open={isShowModal} close={closeModal} onAddField={onAddField} onSaveField={onSaveField} />
        </div>
    )
}
