import { useEffect, useState } from "react";
import SideBar from "components/features/settings/SideBar";
import Tabs from "components/features/settings/Tabs";
import axios from 'axios';

import AppLayout from "layouts/AppLayout";
import { Link, useLoaderData, useParams, useSearchParams } from "react-router-dom";
import NumberPagination from "components/common/NumberPagination";
import { PlusIcon } from "@heroicons/react/20/solid";
import OrderDetails from "components/features/settings/OrderDetails";
import SkeletonTable from "components/common/SkeletonTable";

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
axios.defaults.baseURL = apiEndpoint
axios.defaults.headers.common = {'Authorization': `Bearer ${loginToken}`}

export default function OrdersBillingsShow() {
    const { user } = useLoaderData();
    let { id } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [transaction, setTransaction] = useState([]);


    function loadTransaction() {
        axios.get("/api/transactions/"+id)
            .then(function (response) {
                // handle success
                setIsLoaded(true)
                setTransaction(response.data.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    // Set page title
    useEffect(() => {
        document.title = 'Orders & Billings';
        loadTransaction()
    }, []);


    return (
      <AppLayout  user={user} sideBar={<SideBar />}>
              <Tabs />
              {isLoaded && <OrderDetails order={transaction} />}
              {!isLoaded && <SkeletonTable rows={4} />}
      </AppLayout>
    )
}
