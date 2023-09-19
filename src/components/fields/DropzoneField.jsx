import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function DropzoneField(props) {
  const {meta, label, name, required = false, compact = false} = props
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    noDrag: false,
    onDrop: acceptedFiles => {
      const files = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      setFiles(files);
      if (props.onChange) {
        props.onChange(files);
      }
    }
  });

  const removeFile = file => () => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
    if (props.onChange) {
      props.onChange(newFiles);
    }
  };

  const thumbs = files.map(file => (
    <li key={file.name} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
      <div className="w-0 flex-1 flex items-center">
        <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
        <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button onClick={removeFile(file)} className="font-medium text-indigo-600 hover:text-indigo-500">
          Remove
        </button>
      </div>
    </li>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );


  return (
    <div className="sm:col-span-6">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-800">*</span>}
      </label>
      <div {...getRootProps({ className: "btn-dropzone" })} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {!compact && <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>}
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={name+'-file'}
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Click to select</span>
              <input {...getInputProps()} />
            </label>
            <p className="pl-1">or drag and drop files here</p>
          </div>
          <p className="text-xs text-gray-500">File size up to 50MB</p>
        </div>
      </div>
      
      {(files.length > 0) && <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">Selected files</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
            {thumbs}
          </ul>
        </dd>
      </div>}

      {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}
    </div>
  );
}
