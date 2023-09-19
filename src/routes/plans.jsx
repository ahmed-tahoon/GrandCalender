import { useEffect, useState } from "react";
import SideBar from "components/features/settings/SideBar";
import axios from 'axios';

import AppLayout from "layouts/AppLayout";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import AlertModal from "components/common/AlertModal";
import StandaloneToggleField from "components/standalone-fields/StandaloneToggleField";
import Loader from "components/layout/Loader";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import SuccessAlert from "components/common/SuccessAlert";
import ErrorAlert from "components/common/ErrorAlert";
import AddressFormModal from "components/features/settings/AddressFormModal";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import Tabs from "components/features/settings/Tabs";
import SubscriptionModal from 'components/common/SubscriptionModal';

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function Plans() {
    const { user } = useLoaderData();
    let [searchParams, setSearchParams] = useSearchParams();
    const [currentPlanId, setCurrentPlanId] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [isShowAddressModal, setIsShowAddressModal] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isShowYearly, setIsShowYearly] = useState(user.current_subscription_period === 2 ? true : false);
    const [isAutoRenew, setIsAutoRenew] = useState(true);
    const [plans, setPlans] = useState([]);
    const [cancelSubscriptionModalOpen, setCancelSubscriptionModalOpen] = useState(false);
    const [cancelAndUpgradeModalOpen, setCancelAndUpgradeModalOpen] = useState(false);
    const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
    const [resumeModalOpen, setResumeModalOpen] = useState(false)
    const [downgradeModalOpen, setDowngradeModalOpen] = useState(false);
    const [processingRecurringPayment, setProcessingRecurringPayment] = useState(false);
    const [isShowErrorPaymentAlert, setIsShowErrorPaymentAlert] = useState(user.current_subscription_failed_payment_count > 0);

    function loadPlans() {
        axios.get("/api/plans")
            .then(function (response) {
                // handle success
                setPlans(response.data.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }


    // Set page title
    useEffect(() => {
        document.title = 'Plans';
        loadPlans()

        if(searchParams.get('status')) {
            setTimeout(() => {
                setSearchParams({});
            }, 5000);
        }
    }, []);

    function confirmCancelSubscription() {
        axios.post(`/api/subscriptions/${user.current_subscription_id}/cancel`, {
            _method: 'delete',
        })
            .then(function (response) {
                // handle success
                setCancelSubscriptionModalOpen(false);
                // console.log(response.data);
                if(response.data.status === 'success') {
                    toast.success(response.data.message);
                }
                window.location.reload();
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    const confirmCancelAndUpgradeSubscription = async () => {

        try {
            const payload = {
                period: isShowYearly ? 'yearly' : 'monthly',
                is_yearly_auto_renew: isAutoRenew ? 'yes' : 'no',
                auto_upgrade: true,
                plan_id: currentPlan.id ?? 0,
            }
            const response = await axios.post(`/api/subscriptions/${user.current_subscription_id}/upgrade`, payload);

            if (response.data.status === 'success') {
                toast.success(response.data.message);
            }
            setCancelAndUpgradeModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }

    }

    const confirmResumeSubscription = async () => {
        try {
            const response = await axios.post(`/api/subscriptions/${user.current_subscription_id}/resume`);
            if (response.data.status === 'success') {
                toast.success(response.data.message);
            }
            if (response.data.status === 'error') {
                toast.error(response.data.message);
            }
            setResumeModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    function subscribe(planId) {
        if(!user.billing_address || !user.billing_city || !user.billing_region || !user.billing_country || !user.billing_zipcode) {
            setCurrentPlanId(planId);
            setIsShowAddressModal(true);
        } else {
            setIsRedirecting(true);
            const period = isShowYearly ? 'yearly' : 'monthly';
            window.location.href = apiEndpoint + "/subscribe/"+user.id+"/"+planId+"?period="+period+"&is_yearly_auto_renew="+(isAutoRenew ? 'yes' : 'no');
        }
    }

    function onAddressSaved() {
        setIsRedirecting(true);
        const period = isShowYearly ? 'yearly' : 'monthly';
        window.location.href = apiEndpoint + "/subscribe/"+user.id+"/"+currentPlanId+"?period="+period+"&is_yearly_auto_renew="+(isAutoRenew ? 'yes' : 'no');
    }

    function refundNotes() {
        if(user.current_subscription_created_at) {
            const diff = moment().diff(moment(user.current_subscription_created_at), 'hours');
            if(diff < user.current_plan.auto_refund_before_hours) {
                return <div className="text-grandkit-600 font-medium text-sm mt-2">You will be auto refunded.</div>;
            }
        }

        return <div className="text-red-800 font-medium text-sm mt-2">For refund, please contact support.</div>;
    }

    const modalDescriptionDown = () => {
        if (!user.current_subscription) {
            return;
        }
        const currentPlanItem = user?.current_plan
        const currentSelected = currentPlan
        const isYearly = isShowYearly
        const isSwitchPlan = currentSelected?.switch_plan
        const price = isYearly ? isSwitchPlan?.yearly?.price : isSwitchPlan?.monthly?.price
        const currentPrice = isYearly ? currentSelected?.yearly_price : currentSelected?.monthly_price
        if(user.current_subscription_created_at && currentSelected) {
            const diff = moment().diff(moment(user.current_subscription_created_at), 'hours');
            if (diff < currentPlanItem.auto_refund_before_hours && currentSelected.id === 1) {
                return `We will cancel your current ongoing subscription and ${displayInputText(currentSelected)} you to
                <span class="font-semibold text-gray-800">${currentSelected?.name}</span> immediately. ${currentSelected.id === 1 ? 'You will be auto refunded.' : ''}`
            }
        }
        if (currentSelected && currentSelected.id === 1) {
            return `We will cancel your current subscription and ${displayInputText(currentSelected)} you to <span class="font-semibold text-gray-800">${currentSelected?.name}</span>. after the current billing cycle for <span class="font-semibold text-gray-800">${currentPlanItem.name}</span> is finished.`
        }
        if (isSwitchPlan && price === 0) {
            return `We will cancel your current subscription and ${displayInputText(currentSelected)} you to <span class="font-semibold text-gray-800">${currentSelected?.name}</span>. after the current billing cycle for <span class="font-semibold text-gray-800">${currentPlanItem.name}</span> is finished, Now you are not required to pay any amount and on ${endOfTheDayDateTime(user.current_subscription.original_expires_at)} you will be charged ${currentPrice} ${currentSelected?.currency} for the upcoming ${isYearly ? 'year' : 'month'} renewal.`
        }
        return `We will cancel your current subscription and ${displayInputText(currentSelected)}
        you to <span class="font-semibold text-gray-800">${currentSelected?.name}</span> after the current billing cycle for <span class="font-semibold text-gray-800">${currentPlanItem.name}</span> is finished. Now you are not required to pay any amount and on ${endOfTheDayDateTime(user.current_subscription.original_expires_at)} you will be charged ${currentPrice} ${currentSelected?.currency} for the upcoming ${isYearly ? 'year' : 'month'} renewal.`
    }

    const modalDescriptionUp = () => {
        const currentSelected = currentPlan
        const isSwitchPlan = currentSelected?.switch_plan
        const isYearly = isShowYearly
        const switchPlan = isYearly ? isSwitchPlan?.yearly : isSwitchPlan?.monthly
        const price = isYearly ? isSwitchPlan?.yearly?.price : isSwitchPlan?.monthly?.price
        const currentPrice = isYearly ? currentSelected?.yearly_price : currentSelected?.monthly_price
        if (currentSelected && currentSelected.id === 1) {
            return `We will cancel your current subscription and ${displayInputText(currentSelected)} you to <span class="font-semibold text-gray-800">${currentSelected?.name}</span>. after the current billing cycle for <span class="font-semibold text-gray-800">${user?.current_plan.name}</span> is finished.`
        }
        if (isSwitchPlan && price === 0) {
            return `We will immediately upgrade your subscription to <span class="font-semibold text-gray-800">${currentSelected?.name}</span>, Now you are not required to pay any amount and on ${endOfTheDayDateTime(switchPlan.new_expire_date)} you will be charged ${currentPrice} ${currentSelected?.currency} for the upcoming ${isYearly ? 'year' : 'month'} renewal.`
        }

        if (isSwitchPlan && price > 0) {
            return `We will immediately upgrade your subscription to <span class="font-semibold text-gray-800">${currentSelected?.name}</span>. Now you will pay ${price} ${currentSelected?.currency} and on ${endOfTheDayDateTime(switchPlan.new_expire_date)} you will be charged ${currentPrice} ${currentSelected?.currency} for the upcoming ${isYearly ? 'year' : 'month'} renewal.`
        }
    }

    const endOfTheDayDateTime = ($data) => {
        const date = moment($data).endOf('day');
        // 2023-07-16 23:59 UTC
        return date.format('YYYY-MM-DD HH:mm [UTC]');
    }

    function changeUserSubscriptionAutoRenew(value) {
        axios.post(`/api/my-subscription`, {
            _method: 'put',
            value: value,
        })
            .then(function (response) {
                // handle success
                toast.success(response.data.message);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    // Process Recurring Payment
    function processRecurringPayment() {
        setProcessingRecurringPayment(true)
        const formData = new FormData();
        axios
            .post("/api/renew-subscription", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (response) {
                if (response.data.status === 'success') {
                    toast.success(response.data.message);
                    setIsShowErrorPaymentAlert(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
                if (response.data.status === 'error') {
                    toast.error(response.data.message);
                }
                setProcessingRecurringPayment(false)
            })
            .catch(function (error) {
            });
    }

    function filterPlans() {
        if (user.current_subscription_next_plan) {
            return plans.filter((plan) => plan.id !== user.current_subscription_next_plan.id);
        }

        if (user.current_subscription) {
            return plans.sort((a, b) => (a.order > b.order) ? -1 : 1);
        }
        return plans;
    }

    const handleSubscribe = (plan, yearly) => {
        setCurrentPlan(plan)
        if (!plan.switch_plan) {
            subscribe(plan.id)
            return
        }

        if (isDowngrade(plan)) {
            return setCancelAndUpgradeModalOpen(true)
        }

        if (plan.switch_plan && yearly) {
            if (plan.switch_plan.yearly.allow) {
                setSubscriptionModalOpen(true)
                return
            }
        }

        if (plan.switch_plan && !yearly) {
            if (plan.switch_plan.monthly.allow) {
                setSubscriptionModalOpen(true)
                return
            }
        }

        // Cancel subscription
        return setCancelAndUpgradeModalOpen(true)

    }

    const confirmSubscriptionModal = () => {
        subscribe(currentPlan.id)
        setSubscriptionModalOpen(false)
    }

    /**
     * Display input text upgrade/downgrade based on pricing plan yearly/monthly
     * @param {*} plan
     * @returns
     */
    const displayInputText = (plan) => {
        if (!plan) {
            return 'Upgrade'
        }
        if (!user.current_subscription) {
            return 'Upgrade';
        }
        const currentPlanItem = user.current_plan

        if (currentPlanItem.level < plan.level) {
            return 'Upgrade';
        }
        return 'Downgrade';
    }

    const isDowngrade = (plan) => {
        const currentPlanItem = user.current_plan
        if (!currentPlanItem) {
            return false
        }
        if (!plan) {
            return false
        }

        if (currentPlanItem.level > plan.level) {
            return true;
        }
        return false;
    }

    const downgradeFreePlan = (plan) => {
        setCurrentPlan(plan)
        setDowngradeModalOpen(true)
    }

    return (
        <AppLayout  user={user} sideBar={<SideBar />}>
            <Tabs />

            {(searchParams.get('status') === 'A') && <div className="mt-6"><SuccessAlert title="Subscription activated successfully." /></div>}
            {(searchParams.get('status') != 'A' && searchParams.get('message')) && <div className="mt-6"><ErrorAlert title={'Payment: '+searchParams.get('message')} /></div>}

            {isShowErrorPaymentAlert && <div className="bg-red-50 sm:rounded-lg mt-6">
                <div className="px-4 py-5 sm:p-6">
                    <div className="mt-2 text-sm text-red-700">
                        <p>We are unable to renew your subscription because {user.current_subscription_grace_period_reason}. Please <button onClick={() => subscribe(user.current_plan.id)} className="font-medium underline">update your payment information</button> or try again by clicking <span className="font-medium">"Process Payment Now"</span> below by {user.current_subscription_payment_update_deadline}.</p>
                    </div>
                    <div className="mt-5 text-right">

                    </div>
                </div>
            </div>}

            {(user.current_plan.id != 1 && user.current_subscription_cancelled_at) && <div className="rounded-md bg-yellow-50 p-4 mt-4">
                <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="text-sm text-yellow-700">
                        <p>
                            <b>{user.current_subscription_next_plan ? user.current_subscription_next_plan.name : 'Freemium'}</b> will be activated on {endOfTheDayDateTime(user.current_subscription.original_expires_at)}
                        </p>
                    </div>
                </div>
            </div>}

            {<div className="px-4 pt-4">
                <div className="text-sm text-gray-500 italic">
                    <p>* Prices including VAT.</p>
                </div>
            </div>}

            <div className={`relative mx-auto ${user.current_subscription_next_plan ? '' : 'border-b'} border-gray-200 mb-6 mt-6`}>
                <div className="border max-w-lg mx-auto overflow-hidden rounded-lg shadow-md lg:max-w-none lg:flex mb-6">
                    <div className="flex-1 px-3 py-4 bg-white lg:p-8">
                        <div className="flex justify-between">
                            <h3 className="text-2xl font-extrabold text-gray-900">{user.current_plan.name}</h3>
                            <div>
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-grandkit-600">Current Plan</span>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="flex items-center">
                                <h4 className="flex-shrink-0 pr-4 text-sm font-semibold tracking-wider text-grandkit-600 uppercase bg-white">What's included</h4>
                                <div className="flex-1 border-t-2 border-gray-200"></div>
                            </div>
                            <ul className="mt-6 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-x-6 lg:gap-y-3">
                                {user.current_plan.description.map((point) => (<li key={point} className="flex items-start lg:col-span-1">
                                    <div className="flex-shrink-0">
                                        <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-3 h-3 text-grandkit-600" />
                                        </div>
                                    </div>
                                    <p className="ml-3 text-sm text-gray-700">{point}</p>
                                </li>))}
                            </ul>

                            {!user.current_plan.is_active && <div className="mt-4"><ErrorAlert title="This package has been deactivated, you will be continued to use it until its cancelled or not renewed." /></div>}

                            {!user.current_subscription_cancelled_at && user.current_plan.id !== 1 && <div className="mt-8">
                                <button onClick={() => { setCancelSubscriptionModalOpen(true) }} className="hover:text-gray-700 text-gray-600 text-xs" target="_blank">
                                    Cancel Subscription
                                </button>
                            </div>}
                        </div>
                    </div>

                    <div className="px-6 py-8 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12 min-w-[360px]">
                        {(user.current_plan.id != 1 && user.current_subscription.period === 2 && user.current_plan.original_yearly_price) && <p className="mt-4 text-gray-500 line-through">{user.current_plan.original_yearly_price} {user.current_plan.currency} / year</p>}
                        {(user.current_plan.id != 1 && user.current_subscription.period === 1 && user.current_plan.original_monthly_price) && <p className="mt-4 text-gray-500 line-through">{user.current_plan.original_monthly_price } {user.current_plan.currency} / month</p>}
                        {user.current_plan.id === 1 && <><p className="mt-4 text-gray-500 line-through"></p><div className="flex items-center justify-center mt-2 text-2xl font-extrabold text-gray-900">
                            <span>FREE</span>
                            <span className="ml-3 text-xl font-medium text-gray-500"></span>
                        </div></>}
                        {(user.current_plan.id != 1) && <div className="flex items-center justify-center mt-2 text-2xl font-extrabold text-gray-900">
                            <span>{user.current_subscription.period === 2 ? user.current_plan.yearly_price : user.current_plan.monthly_price } {user.current_plan.currency}</span>
                            <span className="ml-3 text-xl font-medium text-gray-500">/ {user.current_subscription.period === 2 ? 'year' : 'month' }</span>
                        </div>}

                        <div className="mt-8 w-full">
                            {user.current_plan.id != 1 && user.current_subscription.original_expires_at && <div className="font-small text-xs">
                                {!user.current_subscription.is_expired && !user.current_subscription.is_expired_today && <p className="text-gray-700 hover:text-gray-900">Expires at: {endOfTheDayDateTime(user.current_subscription.original_expires_at)}</p>}
                                {user.current_subscription.is_expired && !user.current_subscription.is_expired_today && <p className="text-red-800">Expired on: {endOfTheDayDateTime(user.current_subscription.original_expires_at)}</p>}
                                {user.current_subscription.is_expired_today && <p className="text-red-800">Expires today at {endOfTheDayDateTime(user.current_subscription.original_expires_at)}</p>}
                                {user.current_subscription.is_expired && isShowErrorPaymentAlert && <p className="text-red-800">(Grace period)</p>}
                            </div>}

                            {user.current_plan.id != 1 && user.current_subscription_cancelled_at && <div className="font-small text-xs text-red-800">
                                <p className="mb-2">Cancelled on: {moment(user.current_subscription_cancelled_at).format("YYYY-MM-DD HH:mm [UTC]")}</p>
                                {/* Button Resume */}
                                <button onClick={() => setResumeModalOpen(true)} className="inline-flex w-48 justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:opacity-70">Resume</button>
                            </div>}
                        </div>

                        {!user.current_subscription_cancelled_at && user.current_plan.id != 1 && user.current_subscription.period === 2 && <div className="mt-4 flex items-center justify-center">
                            <StandaloneToggleField enabled={user.current_subscription_auto_renew} label="Auto renew" onChange={(value) => {changeUserSubscriptionAutoRenew(value) }} />
                        </div>}

                        {isShowErrorPaymentAlert && <div className="mt-8 text-sm">
                            <button
                                onClick={processRecurringPayment}
                                disabled={processingRecurringPayment}
                                type="button"
                                className="inline-flex w-48 justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:opacity-70"
                            >
                                {processingRecurringPayment ? 'Processing..' : 'Process Payment Now'}
                            </button>
                        </div>}

                        {isShowErrorPaymentAlert && <div>
                            <button onClick={() => subscribe(user.current_plan.id)} className="text-sm font-medium mt-4 text-gray-800">Update your payment information</button>
                        </div>}
                    </div>
                </div>
            </div>

            {user.current_subscription_next_plan && <div className="relative mx-auto border-b border-gray-200 mb-6 mt-6">
                <div className="border max-w-lg mx-auto overflow-hidden rounded-lg shadow-md lg:max-w-none lg:flex mb-6">
                    <div className="flex-1 px-3 py-4 bg-white lg:p-8">
                        <div className="flex justify-between">
                            <h3 className="text-2xl font-extrabold text-gray-900">{user.current_subscription_next_plan.name}</h3>
                            <div>
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-grandkit-600">Next Plan</span>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="flex items-center">
                                <h4 className="flex-shrink-0 pr-4 text-sm font-semibold tracking-wider text-grandkit-600 uppercase bg-white">What's included</h4>
                                <div className="flex-1 border-t-2 border-gray-200"></div>
                            </div>
                            <ul className="mt-6 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-x-6 lg:gap-y-3">
                                {user.current_subscription_next_plan.description.map((point) => (<li key={point} className="flex items-start lg:col-span-1">
                                    <div className="flex-shrink-0">
                                        <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-3 h-3 text-grandkit-600" />
                                        </div>
                                    </div>
                                    <p className="ml-3 text-sm text-gray-700">{point}</p>
                                </li>))}
                            </ul>

                            {!user.current_subscription_next_plan.is_active && <div className="mt-4"><ErrorAlert title="This package has been deactivated, you will be continued to use it until its cancelled or not renewed." /></div>}
                        </div>
                    </div>

                    <div className="px-6 py-8 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12 min-w-[360px]">
                        {(user.current_subscription_next_plan.id != 1 && user.current_subscription.next_period === 2 && user.current_subscription_next_plan.original_yearly_price) && <p className="mt-4 text-gray-500 line-through">{user.current_subscription_next_plan.original_yearly_price} {user.current_subscription_next_plan.currency} / year</p>}
                        {(user.current_subscription_next_plan.id != 1 && user.current_subscription.next_period === 1 && user.current_subscription_next_plan.original_monthly_price) && <p className="mt-4 text-gray-500 line-through">{user.current_subscription_next_plan.original_monthly_price } {user.current_subscription_next_plan.currency} / month</p>}
                        {user.current_subscription_next_plan.id === 1 && <><p className="mt-4 text-gray-500 line-through"></p><div className="flex items-center justify-center mt-2 text-2xl font-extrabold text-gray-900">
                            <span>FREE</span>
                            <span className="ml-3 text-xl font-medium text-gray-500"></span>
                        </div></>}
                        {(user.current_subscription_next_plan.id != 1) && <div className="flex items-center justify-center mt-2 text-2xl font-extrabold text-gray-900">
                            <span>{user.current_subscription.next_period === 2 ? user.current_subscription_next_plan.yearly_price : user.current_subscription_next_plan.monthly_price } {user.current_subscription_next_plan.currency}</span>
                            <span className="ml-3 text-xl font-medium text-gray-500">/ {user.current_subscription.next_period === 2 ? 'year' : 'month' }</span>
                        </div>}

                        {isShowErrorPaymentAlert && <div className="mt-8 text-sm">
                            <button
                                onClick={processRecurringPayment}
                                disabled={processingRecurringPayment}
                                type="button"
                                className="inline-flex w-48 justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:opacity-70"
                            >
                                {processingRecurringPayment ? 'Processing..' : 'Process Payment Now'}
                            </button>
                        </div>}

                        {isShowErrorPaymentAlert && <div>
                            <button onClick={() => subscribe(user.current_subscription_next_plan.id)} className="text-sm font-medium mt-4 text-gray-800">Update your payment information</button>
                        </div>}
                    </div>
                </div>
            </div>}

            {filterPlans().filter(plan => plan.id != 1).length > 0 && <div className="mb-4 flex justify-between">
                <div></div>
                <StandaloneToggleField enabled={isShowYearly} label="Show yearly price" onChange={(value) => {setIsShowYearly(value) }} />
            </div>}

            {filterPlans().map((plan) => (<div key={plan.id} className="relative mx-auto">
                <div className="max-w-lg mx-auto overflow-hidden rounded-lg shadow-lg lg:max-w-none lg:flex mb-6">
                    <div className="flex-1 px-3 py-4 bg-white lg:p-8">
                        <div className="flex justify-between">
                            <h3 className="text-2xl font-extrabold text-gray-900">{plan.name}</h3>
                            <div>

                            </div>
                        </div>
                        {/* <p className="mt-6 text-base text-gray-500">Metus potenti velit sollicitudin porttitor magnis elit lacinia tempor varius, ut cras orci vitae parturient id nisi vulputate consectetur, primis venenatis cursus tristique malesuada viverra congue risus. Class dui ut ullamcorper ultrices arcu ad varius adipiscing, aliquet imperdiet hendrerit orci fusce ante felis, mi mus vel finibus viverra nibh taciti.</p> */}
                        <div className="mt-8">
                            <div className="flex items-center">
                                <h4 className="flex-shrink-0 pr-4 text-sm font-semibold tracking-wider text-grandkit-600 uppercase bg-white">What's included</h4>
                                <div className="flex-1 border-t-2 border-gray-200"></div>
                            </div>
                            <ul className="mt-6 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-x-6 lg:gap-y-3">
                                {plan.description.map((point) => (<li key={point} className="flex items-start lg:col-span-1">
                                    <div className="flex-shrink-0">
                                        <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-3 h-3 text-grandkit-600" />
                                        </div>
                                    </div>
                                    <p className="ml-3 text-sm text-gray-700">{point}</p>
                                </li>))}
                            </ul>
                        </div>
                    </div>

                    <div className="px-6 py-8 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12 min-w-[360px]">
                        {(plan.id != 1 && isShowYearly && plan.original_yearly_price) && <p className="mt-4 text-gray-500 line-through">{plan.original_yearly_price} {plan.currency} / year</p>}
                        {(plan.id != 1 && !isShowYearly && plan.original_monthly_price) && <p className="mt-4 text-gray-500 line-through">{plan.original_monthly_price } {plan.currency} / month</p>}
                        {plan.id === 1 && <><p className="mt-4 text-gray-500 line-through"></p><div className="flex items-center justify-center mt-2 text-2xl font-extrabold text-gray-900">
                            <span>FREE</span>
                            <span className="ml-3 text-xl font-medium text-gray-500"></span>
                        </div></>}
                        {(user.current_plan_id != plan.id && plan.id != 1) && <div className={`flex items-center justify-center mt-2 text-2xl font-extrabold text-gray-900`}>
                            <span>{isShowYearly ? plan.yearly_price : plan.monthly_price } {plan.currency}</span>
                            <span className="ml-3 text-xl font-medium text-gray-500">/ {isShowYearly ? 'year' : 'month' }</span>
                        </div>}
                        {/* {plan.switch_plan && <div className="flex items-center justify-center mt-2 text-2xl font-extrabold text-gray-900">
                            <span>{isShowYearly ? plan.switch_plan.price : plan.switch_plan.price} {plan.currency}</span>
                            <span className="ml-3 text-xl font-medium text-gray-500">/ {plan.switch_plan.remaining_days}</span>
                        </div>} */}
                        {(user.current_plan_id === plan.id && plan.id != 1) && <div className="flex items-center justify-center mt-2 text-2xl font-extrabold text-gray-900">
                            <span>{isShowYearly ? user.current_plan.yearly_price : user.current_plan.monthly_price } {user.current_plan.currency}</span>
                            <span className="ml-3 text-xl font-medium text-gray-500">/ {isShowYearly ? 'year' : 'month' }</span>
                        </div>}
                        <div className="mt-8 mb-3">
                            {(user.current_plan_id != plan.id && plan.id != 1) && (user.current_subscription_next_plan == null || user.current_subscription_next_plan?.id != plan.id) && <div className="">
                                <button onClick={() => handleSubscribe(plan, isShowYearly)}
                                    rel="nofollow"
                                    className="inline-flex w-48 justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:opacity-70">
                                        {displayInputText(plan)}
                                </button>
                            </div>}

                            {((plan.id === 1 && !user.current_subscription_cancelled_at) || (plan.id === 1 && user.current_subscription_next_plan !== null && user.current_subscription_next_plan?.id != 1)) && <div className="">
                                <button onClick={() => downgradeFreePlan(plan)}
                                    rel="nofollow"
                                    className="inline-flex w-48 justify-center rounded-md border border-transparent bg-grandkit-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grandkit-700 focus:outline-none focus:ring-2 focus:ring-grandkit-500 focus:ring-offset-2 disabled:opacity-70">
                                        Downgrade
                                </button>
                            </div>}

                            {/* {(plan.id === 1 && user.current_plan.id != 1 && user.current_subscription_cancelled_at) && <div className="">
                                {!user.current_subscription.is_expired_today && <span className="inline-flex items-center px-2 py-0.5 text-sm font-medium text-gray-500 w-48">
                                    Will be activated on {endOfTheDayDateTime(user.current_subscription.original_expires_at)}
                                </span>}
                                {user.current_subscription.is_expired_today && <span className="inline-flex items-center px-2 py-0.5 text-sm font-medium text-gray-500 w-48">
                                    Will be activated today at {endOfTheDayDateTime(user.current_subscription.original_expires_at)}
                                </span>}
                            </div>} */}

                            {(plan.id != 1 && isShowYearly && !user.current_subscription_cancelled_at) && <div className="mt-4 flex items-center justify-center">
                                <StandaloneToggleField enabled={isAutoRenew} label="Auto renew" onChange={(value) => {setIsAutoRenew(value) }} />
                            </div>}
                        </div>
                    </div>
                </div>
            </div>))}

            <AlertModal
                title="Cancel subscription"
                note={`Are you sure you want to cancel subscription? After you cancel it, your plan will expire at the end of your current billing cycle.`}
                importantNote={refundNotes()}
                confirm={confirmCancelSubscription}
                close={() => setCancelSubscriptionModalOpen(false)}
                open={cancelSubscriptionModalOpen}
            />

            {/* // Cancel old subscription and upgrade to new subscription after the current billing cycle */}
            <SubscriptionModal
                title={`${displayInputText(currentPlan)} to ${currentPlan?.name}`}
                // We will cancel your current subscription and upgrade to new subscription after the current billing cycle.
                message={modalDescriptionDown()}
                confirm={confirmCancelAndUpgradeSubscription}
                close={() => setCancelAndUpgradeModalOpen(false)}
                open={cancelAndUpgradeModalOpen}
            />

            <SubscriptionModal
                title="Downgrade plan"
                message={modalDescriptionDown()}
                confirm={confirmCancelSubscription}
                close={() => setDowngradeModalOpen(false)}
                open={downgradeModalOpen}
            />

            <SubscriptionModal
                title={`${displayInputText(currentPlan)} to ${currentPlan?.name}`}
                message={modalDescriptionUp()}
                close={() => setSubscriptionModalOpen(false)}
                open={subscriptionModalOpen}
                confirm={confirmSubscriptionModal}
                confirmButtonText="Continue"
            />

            {/* Resume Modal */}
            <SubscriptionModal
                title={`Resume ${user.current_plan.name}`}
                message={`Are you sure you want to resume <span class="font-semibold">${user.current_plan.name}</span>?`}
                close={() => setResumeModalOpen(false)}
                open={resumeModalOpen}
                confirm={confirmResumeSubscription}
                confirmButtonText="Resume"
            />

            {isRedirecting && <Loader text="Redirecting to payment provider. Please don't close your browser." />}

            <AddressFormModal open={isShowAddressModal} close={() => setIsShowAddressModal(false)} user={user} onSaved={onAddressSaved} />
        </AppLayout>
    )
}
