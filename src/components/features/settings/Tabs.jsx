import { useState } from "react"
import { Link } from "react-router-dom"

const tabs = [
    { to: '/dashboard/profile', name: 'Your Profile' },
    { to: '/dashboard/security', name: 'Security' },
    { to: '/dashboard/change-email', name: 'Change Email' },
    { to: '/dashboard/plans', name: 'Subscription'},
    { to: '/dashboard/orders-billings', name: 'Orders'},
    { to: '/dashboard/transactions', name: 'Transactions'},
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Tabs() {
    const location = window.location.pathname

    return (
        <div className="-mt-4">
            <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-s-8" aria-label="Tabs">
                {tabs.map((tab) => (
                <Link
                    key={tab.to}
                    to={tab.to}
                        className={classNames(
                        // Class active tab also if I'm in a subroute
                        location.startsWith(tab.to)
                        ? 'border-grandkit-500 text-grandkit-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                    )}
                    aria-current={location === tab.to ? 'page' : undefined}
                >
                    {tab.name}
                </Link>
                ))}
            </nav>
            </div>
        </div>
    )
}
