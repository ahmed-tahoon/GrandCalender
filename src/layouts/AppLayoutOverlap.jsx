import { Fragment, useEffect, useState } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
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

export default function AppLayoutOverlap(props) {
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
                {/*
          This example requires updating your template:

          ```
          <html class="h-full bg-gray-100">
          <body class="h-full">
          ```
        */}
                {routerNavigation.state === "loading" && <TopLoader />}

                {user.current_subscription_failed_payment_count > 0 && (
                    <ErrorPaymentTopBanner user={user} />
                )}

                <div className="min-h-full bg-gray-100">
                    <Popover as="header" className="bg-grandkit-600 pb-24">
                        {({ open }) => (
                            <>
                                <div className="mx-auto max-w-3xl px-2 sm:px-2 lg:max-w-7xl lg:px-2">
                                    <div
                                        className="relative flex items-center justify-center py-5 lg:justify-between"
                                        dir={dir()}
                                    >
                                        {/* Logo */}
                                        <div className="absolute left-0 flex-shrink-0 lg:static">
                                            <a href="#">
                                                <span className="sr-only">
                                                    {
                                                        import.meta.env
                                                            .VITE_APP_NAME
                                                    }
                                                </span>
                                                <img
                                                    className="h-8 w-auto"
                                                    src={logoWhite}
                                                    alt={
                                                        import.meta.env
                                                            .VITE_APP_NAME
                                                    }
                                                />
                                            </a>
                                        </div>

                                        {/* Right section on desktop */}
                                        <div className="hidden lg:flex lg:items-center lg:pr-0.5">
                                            {/* <button
                        type="button"
                        className="flex-shrink-0 rounded-full p-1 text-grandkit-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button> */}

                                            {/* Profile dropdown */}
                                            <Menu
                                                as="div"
                                                className="relative flex-shrink-0"
                                            >
                                                <div>
                                                    <Menu.Button className="flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
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
                                                                onClick={logout}
                                                                className="w-full text-start hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                                            >
                                                                Sign Out
                                                            </button>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>

                                        {/* Search */}
                                        <div className="min-w-0 flex-1 px-12 lg:hidden">
                                            <div className="mx-auto w-full max-w-xs py-2">
                                                {/* <label htmlFor="desktop-search" className="sr-only">
                          Search
                        </label>
                        <div className="relative text-white focus-within:text-gray-600">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <input
                            id="desktop-search"
                            className="block w-full rounded-md border border-transparent bg-white bg-opacity-20 py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-white focus:border-transparent focus:bg-opacity-100 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                            placeholder="Search"
                            type="search"
                            name="search"
                          />
                        </div> */}
                                            </div>
                                        </div>

                                        {/* Menu button */}
                                        <div className="absolute right-0 flex-shrink-0 lg:hidden">
                                            {/* Mobile menu button */}
                                            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-grandkit-200 hover:bg-white hover:bg-opacity-10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
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
                                            </Popover.Button>
                                        </div>
                                    </div>
                                    <div
                                        className="hidden border-t border-white border-opacity-20 py-5 lg:block"
                                        dir={dir()}
                                    >
                                        <div className="grid grid-cols-3 items-center gap-8">
                                            <div className="col-span-2">
                                                <nav className="flex space-x-4">
                                                    {navigation.map((item) => (
                                                        <Link
                                                            key={item.to}
                                                            to={item.to}
                                                            className={classNames(
                                                                currentMenu ===
                                                                    item.to
                                                                    ? "text-white"
                                                                    : "text-grandkit-100",
                                                                "text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10"
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
                                                </nav>
                                            </div>
                                            <div>
                                                <div className="mx-auto w-full max-w-md">
                                                    {/* <label htmlFor="mobile-search" className="sr-only">
                            Search
                          </label>
                          <div className="relative text-white focus-within:text-gray-600">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <input
                              id="mobile-search"
                              className="block w-full rounded-md border border-transparent bg-white bg-opacity-20 py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-white focus:border-transparent focus:bg-opacity-100 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                              placeholder="Search"
                              type="search"
                              name="search"
                            />
                          </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Transition.Root as={Fragment}>
                                    <div className="lg:hidden">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="duration-150 ease-out"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="duration-150 ease-in"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                                        </Transition.Child>

                                        <Transition.Child
                                            as={Fragment}
                                            enter="duration-150 ease-out"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="duration-150 ease-in"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <Popover.Panel
                                                focus
                                                className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
                                            >
                                                <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                    <div className="pt-3 pb-2">
                                                        <div className="flex items-center justify-between px-4">
                                                            <div>
                                                                <img
                                                                    className="h-8 w-auto"
                                                                    src="https://tailwindui.com/img/logos/mark.svg?color=grandkit&shade=600"
                                                                    alt="Your Company"
                                                                />
                                                            </div>
                                                            <div className="-mr-2">
                                                                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-grandkit-500">
                                                                    <span className="sr-only">
                                                                        Close
                                                                        menu
                                                                    </span>
                                                                    <XMarkIcon
                                                                        className="h-6 w-6"
                                                                        aria-hidden="true"
                                                                    />
                                                                </Popover.Button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 space-y-1 px-2">
                                                            {navigation.map(
                                                                (item) => (
                                                                    <Link
                                                                        key={
                                                                            item.to
                                                                        }
                                                                        to={
                                                                            item.to
                                                                        }
                                                                        className={classNames(
                                                                            currentMenu ===
                                                                                item.to
                                                                                ? "text-grandkit-900"
                                                                                : "text-gray-900",
                                                                            "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-100 hover:text-gray-800"
                                                                        )}
                                                                        aria-current={
                                                                            currentMenu ===
                                                                            item.to
                                                                                ? "page"
                                                                                : undefined
                                                                        }
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 pb-2">
                                                        <div className="flex items-center px-5">
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    className="h-10 w-10 rounded-full"
                                                                    src={
                                                                        user.profile_photo_url
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="ml-3 min-w-0 flex-1">
                                                                <div className="truncate text-base font-medium text-gray-800">
                                                                    {user.name}
                                                                </div>
                                                                <div className="truncate text-sm font-medium text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
                                                            >
                                                                <span className="sr-only">
                                                                    View
                                                                    notifications
                                                                </span>
                                                                <BellIcon
                                                                    className="h-6 w-6"
                                                                    aria-hidden="true"
                                                                />
                                                            </button>
                                                        </div>
                                                        <div className="mt-3 space-y-1 px-2">
                                                            {userNavigation.map(
                                                                (item) => (
                                                                    <Link
                                                                        key={
                                                                            item.name
                                                                        }
                                                                        to={
                                                                            item.to
                                                                        }
                                                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popover.Panel>
                                        </Transition.Child>
                                    </div>
                                </Transition.Root>
                            </>
                        )}
                    </Popover>
                    <main className="-mt-24 pb-8">
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
