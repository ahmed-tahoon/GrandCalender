import { Fragment, useEffect, useState } from "react";
import { Menu, Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "App.css";
import SideBar from "components/features/settings/SideBar";
import { Link, useNavigation } from "react-router-dom";
import TopLoader from "components/layout/TopLoader";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ErrorPaymentTopBanner from "components/common/ErrorPaymentTopBanner";
import logoWhite from "assets/logo_white.svg";

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

// const user = {
//   name: 'Tom Cook',
//   email: 'tom@example.com',
//   profile_photo_url:
//     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
// }
const navigation = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "Plans", to: "/dashboard/plans" },
    { name: "Settings", to: "/dashboard/profile" },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const currentYear = new Date().getFullYear();

export default function AppLayoutBrandedNav(props) {
    const { t, i18n } = useTranslation();
    const [currentMenu, setCurrentMenu] = useState("/");
    const { user } = props;
    const routerNavigation = useNavigation();
    const location = window.location.pathname;

    const [userNavigation, setUserNavigation] = useState([
        { name: t("your_profile"), to: "/dashboard/profile" },
        { name: "Security", to: "/dashboard/security" },
        { name: "Plans & Billing", to: "/dashboard/plans" },
    ]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then((t) => {
            setUserNavigation([
                { name: t("your_profile"), to: "/dashboard/profile" },
                { name: "Security", to: "/dashboard/security" },
                { name: "Plans & Billing", to: "/dashboard/plans" },
            ]);
        });

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("display_language", lng);
        axios
            .post("/api/me", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                //
            })
            .catch(function (error) {
                //
            });
    };

    const dir = () => {
        return i18n.language === "ar" ? "rtl" : "ltr";
    };

    useEffect(() => {
        setCurrentMenu(location);
        if (
            [
                "/dashboard/orders-billings",
                "/dashboard/security",
                "/dashboard/change-email",
            ].includes(location)
        ) {
            setCurrentMenu("/dashboard/profile");
        }
        changeLanguage(user.display_language);
    }, []);

    function logout() {
        localStorage.removeItem("login_token");
        window.location.href = "/login";
    }

    if (user) {
        return (
            <>
                {user.current_subscription_failed_payment_count > 0 && (
                    <ErrorPaymentTopBanner user={user} />
                )}

                {routerNavigation.state === "loading" && <TopLoader />}

                <div className="min-h-full">
                    <Disclosure as="nav" className="bg-grandkit-600">
                        {({ open }) => (
                            <>
                                <div className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-2">
                                    <div className="flex h-16 items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="w-32"
                                                    src={logoWhite}
                                                    alt={
                                                        import.meta.env
                                                            .VITE_APP_NAME
                                                    }
                                                />
                                            </div>
                                            <div className="hidden md:block">
                                                <div className="ml-10 flex items-baseline space-x-4">
                                                    {navigation.map((item) => (
                                                        <Link
                                                            to={item.to}
                                                            key={item.name}
                                                            className={classNames(
                                                                currentMenu ===
                                                                    item.to
                                                                    ? "bg-grandkit-700 text-white"
                                                                    : "text-white hover:bg-grandkit-500 hover:bg-opacity-75",
                                                                "rounded-md px-3 py-2 text-sm font-medium"
                                                            )}
                                                            aria-current={
                                                                currentMenu ===
                                                                item.to
                                                                    ? "page"
                                                                    : undefined
                                                            }
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-4 flex items-center md:ml-6">
                                                {/* <button
                            type="button"
                            className="rounded-full bg-grandkit-600 p-1 text-grandkit-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-grandkit-600"
                          >
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                          </button> */}

                                                {/* Profile dropdown */}
                                                <Menu
                                                    as="div"
                                                    className="relative ml-3"
                                                >
                                                    <div>
                                                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-grandkit-600 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-grandkit-600">
                                                            <span className="sr-only">
                                                                Open user menu
                                                            </span>
                                                            <img
                                                                className="h-8 w-8 rounded-full"
                                                                src={
                                                                    user.profile_photo_url
                                                                }
                                                                alt=""
                                                            />
                                                        </Menu.Button>
                                                    </div>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <div className="px-4 py-3">
                                                                <p className="text-sm">
                                                                    {user.name}
                                                                </p>
                                                                <p className="truncate text-sm font-medium text-gray-900">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                            <div className="py-1">
                                                                {userNavigation.map(
                                                                    (item) => (
                                                                        <Menu.Item
                                                                            key={
                                                                                item.to
                                                                            }
                                                                        >
                                                                            {({
                                                                                active,
                                                                            }) => (
                                                                                <Link
                                                                                    to={
                                                                                        item.to
                                                                                    }
                                                                                    className={classNames(
                                                                                        active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700",
                                                                                        "block px-4 py-2 text-sm"
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </Link>
                                                                            )}
                                                                        </Menu.Item>
                                                                    )
                                                                )}

                                                                <button
                                                                    onClick={
                                                                        logout
                                                                    }
                                                                    className="w-full text-start hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                                                >
                                                                    Sign Out
                                                                </button>
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </div>
                                        </div>
                                        <div className="-mr-2 flex md:hidden">
                                            {/* Mobile menu button */}
                                            <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-grandkit-600 p-2 text-grandkit-200 hover:bg-grandkit-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-grandkit-600">
                                                <span className="sr-only">
                                                    Open main menu
                                                </span>
                                                {open ? (
                                                    <XMarkIcon
                                                        className="block h-6 w-6"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <Bars3Icon
                                                        className="block h-6 w-6"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                </div>

                                <Disclosure.Panel className="md:hidden">
                                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                className={classNames(
                                                    currentMenu === item.to
                                                        ? "bg-grandkit-700 text-white"
                                                        : "text-white hover:bg-grandkit-500 hover:bg-opacity-75",
                                                    "block rounded-md px-3 py-2 text-base font-medium"
                                                )}
                                                aria-current={
                                                    currentMenu === item.to
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="border-t border-grandkit-700 pt-4 pb-3">
                                        <div className="flex items-center px-5">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={user.profile_photo_url}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-base font-medium text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm font-medium text-grandkit-300">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="ml-auto flex-shrink-0 rounded-full bg-grandkit-600 p-1 text-grandkit-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-grandkit-600"
                                            >
                                                <span className="sr-only">
                                                    View notifications
                                                </span>
                                                <BellIcon
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                        <div className="mt-3 space-y-1 px-2">
                                            {userNavigation.map((item) => (
                                                <Link
                                                    to={item.to}
                                                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-grandkit-500 hover:bg-opacity-75"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>

                    {/* <header className="bg-white shadow-sm">
              <div className="mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-lg font-semibold leading-6 text-gray-900">Dashboard</h1>
              </div>
            </header> */}
                    {/* <main>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"></div>
            </main> */}
                    <main className="mt-8 pb-8">
                        <div className="mx-auto max-w-3xl px-2 sm:px-2 lg:max-w-7xl lg:px-2">
                            <h1 className="sr-only">
                                {import.meta.env.VITE_APP_NAME}
                            </h1>
                            {/* Main 3 column grid */}
                            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                                {/* Left column */}
                                <div
                                    className="grid grid-cols-1 gap-4 lg:col-span-2"
                                    dir={dir()}
                                >
                                    <section aria-labelledby="section-1-title">
                                        <h2
                                            className="sr-only"
                                            id="section-1-title"
                                        >
                                            Main
                                        </h2>
                                        <div className="rounded-lg bg-white shadow">
                                            <div className="p-6">
                                                {props.children}
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right column */}
                                <div className="grid grid-cols-1 gap-4">
                                    <section
                                        aria-labelledby="section-2-title"
                                        dir={dir()}
                                    >
                                        <h2
                                            className="sr-only"
                                            id="section-2-title"
                                        >
                                            Side bar
                                        </h2>
                                        <div className="rounded-lg bg-white shadow">
                                            <div className="p-6">
                                                {/* {props.sideBar} */}
                                                <SideBar user={user} />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer dir={dir()}>
                        <div className="mx-auto max-w-3xl px-2 sm:px-2 lg:max-w-7xl lg:px-2">
                            <div className="flex justify-between items-center">
                                <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
                                    <span className="block sm:inline">
                                        &copy; {currentYear}{" "}
                                        {import.meta.env.VITE_APP_NAME}.
                                    </span>{" "}
                                    <span className="block sm:inline">
                                        All rights reserved.
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 space-s-4">
                                    <button
                                        onClick={() => {
                                            changeLanguage("en");
                                        }}
                                        className="hover:text-grandkit-600"
                                    >
                                        EN
                                    </button>
                                    <button
                                        onClick={() => {
                                            changeLanguage("ar");
                                        }}
                                        className="hover:text-grandkit-600"
                                    >
                                        AR
                                    </button>
                                    <a
                                        href="#"
                                        target="_blank"
                                        rel="nofollow"
                                        className="hover:text-grandkit-600"
                                    >
                                        {t("privacy_policy")}
                                    </a>
                                    <a
                                        href="#"
                                        target="_blank"
                                        rel="nofollow"
                                        className="hover:text-grandkit-600"
                                    >
                                        {t("terms_and_conditions")}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>

                <ToastContainer theme="colored" position="top-right" />
            </>
        );
    }
}
