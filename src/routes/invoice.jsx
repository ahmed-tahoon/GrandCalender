import { useEffect, useState } from "react";
import axios from 'axios';
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { useLoaderData, useParams } from "react-router-dom";
import logo from "assets/brackets-logo.svg";
import { Invoice as Zacat } from '@axenda/zatca';
import {Buffer} from "buffer";

window.Buffer = Buffer;

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

const returnQr = async ({ name, id, created_at, amount }) => {
    console.log(name, id, created_at, amount);
    const invoice = new Zacat({
        sellerName: name,
        vatRegistrationNumber: id,
        invoiceTimestamp: created_at,
        invoiceTotal: amount,
        invoiceVatTotal: amount,
    });

    const imageData = await invoice.render();

    return imageData;
};

export default function Invoice() {
    const { user } = useLoaderData();
    let { id } = useParams();
    const [transaction, setTransaction] = useState([]);
    const [image, setImage] = useState(null);

    const loadTransaction = async (params = {}) => {
        try {
            const response = await axios.get(`/api/transactions/${id}`, {
                params: params,
            });
            setTransaction(response.data.data);
            const image = await returnQr({
                name: response.data.data.company_settings.company_name,
                id: response.data.data.company_settings.company_id,
                created_at: response.data.data.created_at,
                amount: response.data.data.total,
            });
            setImage(image)
        } catch (error) {
            console.log(error);
        }
    }

    const findKey = (obj, value) => {
        // obj array of objects
        // {key, value}
        if (!obj) return;
        return obj.find(o => o.key === value).value;
    }

    // Set page title
    useEffect(() => {
        document.title = "Event Types";
        loadTransaction()
    }, []);

    // create print button and print div content
    const printDiv = () => {
        // Print window using react by specifce div
        window.print();
    };



    return (
        <AppLayout user={user} sideBar={<SideBar />} sideBarStatus={false} layoutType="many_left_blocks">
            {/* Print Button */}
            <div className="flex flex-row justify-end mb-4">
                <button
                    className="px-4 py-2 text-sm font-medium text-white bg-grandkit-600 rounded-md hover:bg-grandkit-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    onClick={printDiv}
                >
                    Print
                </button>
            </div>
            <hr />
            <div className="rounded-lg bg-white shadow p-4">
            <div id="section-to-print" className="w-full relative">
                <div className="p-4 print:bg-white">
                    {/* Invoice #0472 */}
                    <div className="flex flex-row justify-between">
                        {/* Logo and Company Name and address and date */}
                        <div className="flex flex-col">
                            <img
                                src={logo}
                                alt="Grand Calendar"
                                className="mb-4 w-56"
                            />
                        </div>
                        <div>
                            <div className="flex">
                                <div className="flex flex-col text-right">
                                    <div className="text-base font-semibold">
                                        #{transaction.subscription_number}
                                    </div>
                                    <div className="text-sm font-light uppercase">
                                        INVOICE NUMBER
                                    </div>
                                </div>
                                <div className="h-20 w-20 flex items-center justify-center bg-gray-100 ml-4">
                                     <img alt="Invoice QR Code" src={image} />
                                </div>
                            </div>
                            <div className="text-right text-xs text-gray-500 pt-2">
                                <p>This QR code has beeen generated as</p>
                                <p>per ZACAT's regulations</p>
                            </div>
                        </div>
                    </div>
                    {/* Customer Details: Ahmed Mamdouh, gm.xerk@gmail.com, address, Country City  */}
                    <div className="font-semibold px-4 mb-1 text-sm">FROM</div>
                    <div className="rounded bg-gray-100 px-4 py-4 mb-3">
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <div className="text-sm font-semibold">
                                    {transaction?.company_settings?.company_name}
                                </div>
                                <div className="pt-0.5 space-y-0.5">
                                    <div className="text-xs font-light">
                                        Company ID: {transaction?.company_settings?.company_id}
                                    </div>
                                    <div className="text-xs font-light">
                                        {transaction?.company_settings?.company_address}
                                    </div>
                                    <div className="text-xs font-light">
                                        TRN: {transaction?.company_settings?.trn_no}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col  text-right">
                                <div className="text-sm font-semibold">
                                    {transaction?.company_settings?.company_name_ar}
                                </div>
                                <div className="pt-0.5 space-y-0.5">
                                    <div className="text-xs font-light">
                                        السجل التجاري: {transaction?.company_settings?.company_id}
                                    </div>
                                    <div className="text-xs font-light">
                                        {transaction?.company_settings?.company_address_ar}
                                    </div>
                                    <div className="text-xs font-light">
                                        الرقم الضريبي: {transaction?.company_settings?.trn_no}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="font-semibold px-4 text-sm mb-1">TO</div>
                    <div className="rounded bg-gray-100 px-4 py-4">
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <div className="text-sm font-semibold">
                                    Customer Details
                                </div>
                                <div className="pt-0.5 space-y-0.5">
                                    <div className="text-xs font-light">
                                        {user.name}
                                    </div>
                                    <div className="text-xs font-light">
                                        {user.email}
                                    </div>
                                    <div className="text-xs font-light">
                                        {transaction.billing_country}
                                    </div>
                                    <div className="text-xs font-light">
                                        {transaction.billing_address}
                                    </div>
                                    {/* <div className="text-xs font-light">
                                        {user.phone ?? "No Phone"}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-x-auto mt-4">
                        <table className="w-full text-sm text-left text-gray-800 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded-md">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 rounded-l-md uppercase"
                                    >
                                        Description / الوصف
                                    </th>
                                    <th scope="col" className="px-4 py-3 uppercase">
                                        Quantity / الكمية
                                    </th>
                                    <th scope="col" className="px-4 py-3 uppercase">
                                        RATE / السعر
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 rounded-r-md uppercase"
                                    >
                                        Tax / الضريبة
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 rounded-r-md uppercase"
                                    >
                                        Total / الإجمالي
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th
                                        scope="row"
                                        className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        <div className="font-semibold text-sm">
                                            Grandcalendar Services
                                        </div>
                                        {/* <div className="text-xs font-light">
                                            310571S
                                        </div> */}
                                        <ul className="pt-0.5 space-y-0.5 text-sm font-light list-inside list-disc px-4">
                                            <li>Plan: <span className="font-semibold">{transaction?.plan_data?.name ?? 'N/A'}</span></li>
                                            <li>
                                                Payment Duration:{" "}
                                                <span className="font-medium">
                                                    {transaction.subscription_period}
                                                </span>
                                            </li>
                                            <li>
                                                {transaction.subscription_date_range}
                                            </li>
                                        </ul>
                                    </th>
                                    <td className="px-4 py-4">1</td>
                                    <td className="px-4 py-4">{transaction.amount}</td>
                                    <td className="px-4 py-4">{transaction.vat_amount}</td>
                                    <td className="px-4 py-4 font-bold">
                                        {/* <span className="text-xs">SAR</span> */}
                                         {transaction.total}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex items-end w-full flex-col my-6 space-y-4 text-gray-800">
                            {/* Subtotal  */}
                            <div className="flex justify-between text-sm font-medium items-center">
                                <div className="text-gray-500">
                                    Subtotal / الإجمالي
                                </div>
                                <div className="px-4 w-40 text-right font-semibold">
                                    {/* <span className="text-xs">SAR</span>{" "} */}
                                    {transaction.amount}
                                </div>
                            </div>
                            {/* Tax  */}
                            <div className="flex justify-between text-sm font-medium items-center">
                                <div className="text-gray-500">
                                    Tax / الضريبة
                                </div>
                                <div className="px-4 w-40 text-right font-semibold">
                                    {/* <span className="text-xs">SAR</span>{" "} */}
                                    {transaction.vat_amount}
                                </div>
                            </div>
                            {/* Total  */}
                            <div className="flex justify-between text-sm font-medium items-center">
                                <div className="text-gray-500">
                                    Total / الإجمالي
                                </div>
                                <div className="px-4 w-40 text-right font-semibold">
                                    {/* <span className="text-xs">SAR</span>{" "} */}
                                    {transaction.total}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* sticky footer background gray 100 content: "This is a computer-generated invoice, no signature is required" */}
                <div className="bg-gray-100 text-sm text-gray-500 print:fixed bottom-0 w-full px-4 py-8 text-center print:m-0">
                    This is a computer-generated invoice, no signature is
                    required
                </div>
            </div>
            </div>
        </AppLayout>
    );
}
