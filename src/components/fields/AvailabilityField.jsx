import { DocumentDuplicateIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import StandaloneToggleField from 'components/standalone-fields/StandaloneToggleField';
import { useState } from 'react'
import timeSlots from 'utils/timeSlots';
import Select from 'react-select'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

export default function AvailabilityField(props) {
    const { label, input, meta, placeholder = null, col = 3, required = false, mode = 'normal' } = props

    const [weekDays, setWeekDays] = useState(input.value ? input.value : [
        {
            name: "Sunday",
            enabled: true,
            slots: [
                { start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'} },
            ]
        },
        {
            name: "Monday",
            enabled: false,
            slots: [
                { start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'} },
            ]
        },
        {
            name: "Tuesday",
            enabled: false,
            slots: [
                { start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'} },
            ]
        },
        {
            name: "Wednesday",
            enabled: false,
            slots: [
                { start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'} },
            ]
        },
        {
            name: "Thursday",
            enabled: false,
            slots: [
                { start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'} },
            ]
        },
        {
            name: "Friday",
            enabled: false,
            slots: [
                { start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'} },
            ]
        },
        {
            name: "Saturday",
            enabled: false,
            slots: [
                { start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'} },
            ]
        },
    ]);

    const [copyingWeekDays, setCopyingWeekDays] = useState([]);

    function handleWeekDayEnabledChange(value, index) {
        let newWeekDays = weekDays.slice();
        newWeekDays[index].enabled = value;
        if(value && newWeekDays[index].slots.length === 0) {
            newWeekDays[index].slots.push({ start: {value: 37, label: '09:00 AM'}, end: {value: 69, label: '05:00 PM'} });
        }
        setWeekDays(newWeekDays)
        input.onChange(newWeekDays)
    }

    function getTimeSlotLabel(value) {
        let label = '';
        timeSlots().forEach((timeSlot) => {
            if(timeSlot.value === value) label = timeSlot.label;
        })
        return label;
    }

    function addWeekdaySlot(index) {
        let newWeekDays = weekDays.slice();
        const lastSlot = newWeekDays[index].slots[newWeekDays[index].slots.length - 1];
        const startValue = lastSlot.end.value + 1;
        let endValue = startValue + 4;
        if(startValue < 96 && endValue > 96) {
          endValue = 96;
        }
        if(startValue < 96 && endValue <= 96) {
            newWeekDays[index].slots.push({
                start: {value: startValue, label: getTimeSlotLabel(startValue)},
                end: {value: endValue, label: getTimeSlotLabel(endValue)}
            });
            setWeekDays(newWeekDays)
            input.onChange(newWeekDays)
        }
    }

    function removeWeekDaySlot(index, slotIndex) {
        let newWeekDays = weekDays.slice();
        newWeekDays[index].slots.splice(slotIndex, 1);

        if(newWeekDays[index].slots.length === 0) {
            newWeekDays[index].enabled = false;
        }

        setWeekDays(newWeekDays)
        input.onChange(newWeekDays)
    }

    function handleTimeSlotStartChange(value, index, slotIndex) {
        let newWeekDays = weekDays.slice();
        newWeekDays[index].slots[slotIndex].start = value;
        setWeekDays(newWeekDays)
        input.onChange(newWeekDays)
    }

    function handleTimeSlotEndChange(value, index, slotIndex) {
        let newWeekDays = weekDays.slice();
        newWeekDays[index].slots[slotIndex].end = value;
        setWeekDays(newWeekDays)
        input.onChange(newWeekDays)
    }

    function handleCopyingWeekDaysChange(value) {
        let newCopyingWeekDays = copyingWeekDays.slice();
        if(!newCopyingWeekDays.includes(value)) {
            newCopyingWeekDays.push(value)
        } else {
            newCopyingWeekDays.splice(newCopyingWeekDays.indexOf(value), 1)
        }
        setCopyingWeekDays(newCopyingWeekDays)
    }

    function copyWeekDays(weekDay) {
        let newWeekDays = weekDays.slice();
        copyingWeekDays.forEach((copyingWeekDay) => {
            newWeekDays[copyingWeekDay].enabled = weekDay.enabled
            newWeekDays[copyingWeekDay].slots = weekDay.slots.slice()
        })
        setWeekDays(newWeekDays)
        input.onChange(newWeekDays)
        setCopyingWeekDays([])
    }

    function findOverlap(slot, slotIndex, weekDayIndex) {
        let isOverlap = false;
        weekDays[weekDayIndex].slots.forEach((weekDaySlot, weekDaySlotIndex) => {
            // Inside or equal
            if(slotIndex !== weekDaySlotIndex
                && (slot.start.value >= weekDaySlot.start.value
                    && slot.end.value <= weekDaySlot.end.value)) isOverlap = true;
            // Cross start
            if(slotIndex !== weekDaySlotIndex
                && (slot.start.value < weekDaySlot.start.value
                    && slot.end.value > weekDaySlot.start.value)) isOverlap = true;
            // Cross end
            if(slotIndex !== weekDaySlotIndex
                && (slot.start.value < weekDaySlot.end.value
                    && slot.end.value > weekDaySlot.end.value)) isOverlap = true;
            // Cross all
            if(slotIndex !== weekDaySlotIndex
                && (slot.start.value < weekDaySlot.start.value
                    && slot.end.value > weekDaySlot.end.value)) isOverlap = true;
        })
        return isOverlap;
    }

    return (
        <div className={'sm:col-span-'+col}>
            <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-800">*</span>}
            </label>
            <div className="mt-1 relative">
                {weekDays.map((weekDay, index) => (<div key={index} className="border-b flex justify-between py-3 min-h-[64px]">
                    <div className="w-32 mt-2">
                        <StandaloneToggleField
                            enabled={weekDay.enabled}
                            label={weekDay.name}
                            onChange={(value) => handleWeekDayEnabledChange(value, index)}
                        />
                    </div>

                    {weekDay.enabled && <div className="space-y-2">
                        {weekDay.slots.map((slot, slotIndex) => (<div key={slotIndex}>
                            <div className="flex justify-between items-center space-s-3">
                                <Select
                                    onChange={(value) => handleTimeSlotStartChange(value, index, slotIndex)}
                                    options={timeSlots()}
                                    value={slot.start}
                                    className="basic-multi-select"
                                    classNamePrefix="react-select"
                                />
                                <span className="px-1">-</span>
                                <Select
                                    onChange={(value) => handleTimeSlotEndChange(value, index, slotIndex)}
                                    options={timeSlots()}
                                    value={slot.end}
                                    className="basic-multi-select w-[133px]"
                                    classNamePrefix="react-select"
                                />

                                {mode === 'normal' && <button
                                    onClick={() => removeWeekDaySlot(index, slotIndex)}
                                    type="button"
                                    className="rounded-full bg-transparent p-1 text-white hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                                >
                                    <TrashIcon className="h-5 w-5 text-grandkit-600" aria-hidden="true" />
                                </button>}
                            </div>

                            {slot.start.value >= slot.end.value &&
                                <div className="text-red-800 text-sm mt-1">Start time must be less than end time.</div>
                            }
                            {findOverlap(slot, slotIndex, index) &&
                                <div className="text-red-800 text-sm mt-1">Times overlap with another set of times.</div>
                            }
                        </div>))}
                    </div>}

                    {weekDay.enabled && <div className="flex justify-between items-start space-s-3 mt-1">
                        {mode === 'normal' && <button
                            onClick={() => addWeekdaySlot(index)}
                            type="button"
                            className="rounded-full bg-transparent p-1 text-white hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                        >
                            <PlusIcon className="h-5 w-5 text-grandkit-600" aria-hidden="true" />
                        </button>}

                        {mode === 'normal' && <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button
                                onClick={() => setCopyingWeekDays([])}
                                type="button"
                                className="rounded-full bg-transparent p-1 text-white hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                            >
                                <DocumentDuplicateIcon className="h-5 w-5 text-grandkit-600" aria-hidden="true" />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-3 divide-y divide-gray-100">
                                        <h2 className="text-xs font-medium leading-3 py-4 uppercase">Copy times to</h2>
                                        <div className="space-y-2 py-3">
                                            {weekDays.map((copyWeekDay, copyWeekDayIndex) => (<div key={copyWeekDayIndex} className="relative flex items-start">
                                                <div className="flex h-6 items-center">
                                                    <input
                                                        id={copyWeekDay.name}
                                                        value={copyWeekDayIndex}
                                                        onChange={() => handleCopyingWeekDaysChange(copyWeekDayIndex)}
                                                        name={copyWeekDay.name}
                                                        checked={copyWeekDay.name === weekDay.name || copyingWeekDays.includes(copyWeekDayIndex)}
                                                        disabled={copyWeekDay.name === weekDay.name}
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-grandkit-600 focus:ring-grandkit-600 disabled:opacity-70"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm leading-6">
                                                    <label htmlFor={copyWeekDay.name} className="font-medium text-gray-900">
                                                        {copyWeekDay.name}
                                                    </label>
                                                </div>
                                            </div>))}
                                        </div>
                                        <Menu.Item>
                                            <button type="button" onClick={() => copyWeekDays(weekDay)} className="g-primary-btn-sm w-full flex justify-center items-center mb-3">Apply</button>
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>}
                    </div>}
                    {!weekDay.enabled && <div className="text-sm text-gray-600 mt-2">Unavailable</div>}
                </div>))}

                {/* <input
                    {...input}
                    type="text"
                    placeholder={placeholder}
                    className={ (meta.error && meta.touched) ? 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-800 focus:border-red-800 sm:text-sm rounded-md' : 'shadow-sm focus:ring-grandkit-500 focus:border-grandkit-500 block w-full sm:text-sm border-gray-300 rounded-md'}
                /> */}

            </div>
            {meta.error && meta.touched && <p className="mt-2 text-sm text-red-800">{meta.error}</p>}

        </div>
    )
}
