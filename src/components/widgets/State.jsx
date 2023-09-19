import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
    CheckCircleIcon,
    CodeBracketIcon,
    EllipsisVerticalIcon,
    FlagIcon,
    GlobeAltIcon,
    StarIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function State(props) {
    const { label, value, value2 = 0, total = 0, icon, avg = null, link, twice = false } = props;

    return (
        <Link
            to={link}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
        >
            <dt>
                <div className="absolute rounded-md bg-grandkit-500 p-3">
                    <props.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                    />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                    {label} {twice && <span className="text-xs ml-0.5">({total})</span>}
                </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                {!twice && <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {value}
                </p>}
                {twice && <div className="mt-1">
                    <div>
                        <span className="text-base text-green-600 font-semibold">{value}</span><span className="text-xs ml-1">ON</span>
                    </div>
                    <div>
                        <span className="text-red-800 text-base font-semibold">{value2}</span><span className="text-xs ml-1">OFF</span>
                    </div>
                </div>}
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                        <Link
                            to={link}
                            className="font-medium text-grandkit-600 hover:text-grandkit-500"
                        >
                            View all
                            <span className="sr-only"> Label stats</span>
                        </Link>
                    </div>
                </div>
            </dd>
        </Link>
    );
}
