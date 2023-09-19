import { useEffect, useState } from "react";
import List from "components/features/calendars/List";
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { useLoaderData } from "react-router-dom";
import Loader from "components/layout/Loader";

export default function Calendars() {
    const { user } = useLoaderData();
    const [isLoaded, setIsLoaded] = useState(true);


    // Set page title
    useEffect(() => {
        document.title = 'Calendars';
    }, []);

    if(!isLoaded) return <Loader />

    return (
        <AppLayout user={user} sideBar={<SideBar />}>
            <List user={user} />
        </AppLayout>
    )
}
