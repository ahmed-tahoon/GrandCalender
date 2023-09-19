import { useEffect, useState, Fragment } from "react";
import { Menu, Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "App.css";
import logo from "assets/logo.svg";
import navigation from "utils/navigation";
import SideBar from "components/features/settings/SideBar";
import { Link, useNavigation, useLocation } from "react-router-dom";
import TopLoader from "components/layout/TopLoader";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ErrorPaymentTopBanner from "components/common/ErrorPaymentTopBanner";
import { UserCircleIcon, ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

// Axios
const loginToken = localStorage.getItem("login_token");
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const currentYear = new Date().getFullYear();

const pages = [
    { name: 'Projects', href: '#', current: false },
    { name: 'Project Nero', href: '#', current: true },
  ]

export default function AppLayout(props) {
    const { t, i18n } = useTranslation();
    const [currentMenu, setCurrentMenu] = useState("/");
    const { user, layoutType = "one_left_block", sideBarStatus = true } = props;
    const routerNavigation = useNavigation();
    const location = window.location.pathname;

    const [userNavigation, setUserNavigation] = useState([
        { name: t("account_settings"), to: "/dashboard/profile" },
        { name: t("integrations"), to: "/dashboard/integrations" },
        { name: "Subscription", to: "/dashboard/plans" },
        { name: "Orders & Billing", to: "/dashboard/orders-billings" },
    ]);

    // Create Breadcrumb navigation with react-router-dom and tailwindcss https://tailwindui.com/components/application-ui/navigation/breadcrumbs and icons https://heroicons.com/
    const locationRoute = useLocation();
    const pathnames = locationRoute.pathname.split('/').filter((x) => x);
    const totalItems = pathnames.length;


    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then((t) => {
            setUserNavigation([
                { name: t("account_settings"), to: "/dashboard/profile" },
                { name: t("integrations"), to: "/dashboard/integrations" },
                { name: "Subscription", to: "/dashboard/plans" },
                { name: "Orders & Billing", to: "/dashboard/orders-billings" },
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
                "/dashboard/plans",
                "/dashboard/orders-billings",
                "/dashboard/security",
                "/dashboard/change-email",
            ].includes(location)
        ) {
            setCurrentMenu("/dashboard/profile");
        }
        if (["/dashboard/calendars/create"].includes(location)) {
            setCurrentMenu("/dashboard");
        }
        if (["/dashboard/availability/create"].includes(location)) {
            setCurrentMenu("/dashboard/availability");
        }
        if (["/dashboard/calendars/create"].includes(location)) {
            setCurrentMenu("/dashboard");
        }
        if (location.substring(0, 20) === "/dashboard/calendars") {
            setCurrentMenu("/dashboard/calendars");
        }
        if (location.substring(0, 20) === "/dashboard/calendars") {
            setCurrentMenu("/dashboard/calendars");
        }
        if (location.substring(0, 23) === "/dashboard/availability") {
            setCurrentMenu("/dashboard/availability");
        }
        if (location.substring(0, 23) === "/dashboard") {
            setCurrentMenu("/dashboard");
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

                <div className="flex flex-col h-screen relative">
                    <Disclosure as="nav" className="bg-white shadow-sm">
                        {({ open }) => (
                            <>
                                <div
                                    className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-2"
                                    dir={dir()}
                                >
                                    <div className="flex h-16 justify-between">
                                        <div className="flex">
                                            <div className="flex flex-shrink-0 items-center">
                                                <Link to="/dashboard">
                                                    <img
                                                        className="block h-8 w-auto lg:hidden"
                                                        src={logo}
                                                        alt={
                                                            import.meta.env
                                                                .VITE_APP_NAME
                                                        }
                                                    />
                                                    <img
                                                        className="hidden h-8 w-auto lg:block"
                                                        src={logo}
                                                        alt={
                                                            import.meta.env
                                                                .VITE_APP_NAME
                                                        }
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="hidden sm:ml-6 sm:flex sm:items-center space-s-8">
                                            {/* <button
                            type="button"
                            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
                        >
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button> */}

                                            {/* Profile dropdown */}
                                            <div className="flex h-16">
                                                <div className="hidden sm:-my-px sm:ml-6 rtl:sm:mr-6 sm:flex sm:space-s-8">
                                                    {navigation.map((item) => (
                                                        <Link
                                                            to={item.to}
                                                            key={item.name}
                                                            className={classNames(
                                                                currentMenu ===
                                                                    item.to
                                                                    ? "border-grandkit-500 text-gray-900"
                                                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                                "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
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
                                            <Menu as="div" className="relative">
                                                <div>
                                                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2">
                                                        <span className="sr-only">
                                                            Open user menu
                                                        </span>
                                                        {!user.profile_photo_url && (
                                                            <UserCircleIcon
                                                                className="h-8 w-8 text-gray-300 border rounded-full"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        {user.profile_photo_url && (
                                                            <img
                                                                className="h-8 w-8 rounded-full"
                                                                src={
                                                                    user.profile_photo_url
                                                                }
                                                                alt=""
                                                            />
                                                        )}
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-200"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {userNavigation.map(
                                                            (item) => (
                                                                <Menu.Item
                                                                    key={
                                                                        item.name
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
                                                                                    ? "bg-gray-100"
                                                                                    : "",
                                                                                "block px-4 py-2 text-sm text-gray-700"
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
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                        <div className="-mr-2 flex items-center sm:hidden">
                                            {/* Mobile menu button */}
                                            <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2">
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

                                <Disclosure.Panel className="sm:hidden">
                                    <div className="space-y-1 pt-2 pb-3">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.to}
                                                to={item.to}
                                                className={classNames(
                                                    currentMenu === item.to
                                                        ? "border-grandkit-500 bg-grandkit-50 text-grandkit-700"
                                                        : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                                                    "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
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
                                    <div className="border-t border-gray-200 pt-4 pb-3">
                                        <div className="flex items-center px-4">
                                            <div className="flex-shrink-0">
                                                {!user.profile_photo_url && (
                                                    <UserCircleIcon
                                                        className="h-10 w-10 text-gray-300 border rounded-full"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {user.profile_photo_url && (
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={
                                                            user.profile_photo_url
                                                        }
                                                        alt=""
                                                    />
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-base font-medium text-gray-800">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm font-medium text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2"
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
                                        <div className="mt-3 space-y-1">
                                            {userNavigation.map((item) => (
                                                <Disclosure.Button
                                                    key={item.name}
                                                    as="a"
                                                    href={item.href}
                                                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                                >
                                                    {item.name}
                                                </Disclosure.Button>
                                            ))}
                                        </div>
                                    </div>
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>

                    <main className="py-8 flex-grow">
                        <div className="mx-auto max-w-3xl px-2 sm:px-2 lg:max-w-7xl lg:px-2">
                            <h1 className="sr-only">
                                {import.meta.env.VITE_APP_NAME}
                            </h1>
                            <div className="bg-gray-100 rounded-md mb-6">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol role="list" className="flex items-center space-x-3">
                                    <li>
                                        <div>
                                            <Link to="/dashboard" className="text-gray-400 hover:text-gray-500">
                                            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                            <span className="sr-only">Home</span>
                                            </Link>
                                        </div>
                                    </li>
                                        {pathnames.map((name, index) => {
                                            const isLast = index === totalItems - 1;
                                            const linkContent = (
                                                <Fragment>
                                                  <ChevronRightIcon className="mr-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                  {name}
                                                </Fragment>
                                              );
                                              return (
                                                <li key={name} className="flex items-center capitalize">
                                                  {isLast ? (
                                                    <div className="flex items-center text-grandkit-600 text-sm font-medium">{linkContent}</div>
                                                  ) : (
                                                    <Link
                                                      to={`/${pathnames.slice(0, index + 1).join('/')}`}
                                                      className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                                                    >
                                                      {linkContent}
                                                    </Link>
                                                  )}
                                                </li>
                                              );
                                        })}
                                </ol>
                            </nav>
                        </div>
                            {/* Main 3 column grid */}
                            <div className={`grid grid-cols-1 items-start gap-4 lg:grid-cols-${sideBarStatus ? "3" : "2"} lg:gap-8`}>
                                {/* Left column */}
                                <div
                                    className={`grid grid-cols-1 gap-4 lg:col-span-2`}
                                    dir={dir()}
                                >
                                    <section aria-labelledby="section-1-title">
                                        <h2
                                            className="sr-only"
                                            id="section-1-title"
                                        >
                                            Main
                                        </h2>
                                        {layoutType ===
                                            "one_left_block" && (
                                            <div className="rounded-lg bg-white shadow">
                                                <div className="p-6">
                                                    {props.children}
                                                </div>
                                            </div>
                                        )}
                                        {layoutType ===
                                            "many_left_blocks" && (
                                            <div>{props.children}</div>
                                        )}
                                    </section>
                                </div>

                                {/* Right column */}
                                {sideBarStatus && <div className="grid grid-cols-1 gap-4">
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
                                </div>}
                            </div>
                        </div>
                    </main>

                    <footer dir={dir()}>
                        <div className="border-t border-gray-200 mx-auto max-w-3xl px-2 sm:px-2 lg:max-w-7xl lg:px-2">
                            <div className="flex justify-between items-center">
                                <div className="py-8 text-center text-sm text-gray-500 sm:text-left">
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
