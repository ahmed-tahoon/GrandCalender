import { useEffect } from "react";
import Pagination from "components/common/Pagination";
import List from "components/features/calendars/List";
import SectionHeading from "components/features/calendars/SectionHeading";
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { useLoaderData } from "react-router-dom";

export default function Root() {
    const { user } = useLoaderData();

    // Set page title
    useEffect(() => {
        document.title = 'Event Types';
    }, []);
    
    return (
        <AppLayout user={user} sideBar={<SideBar />}>
            {/* <SectionHeading user={user} />
            <List />
            <Pagination /> */}
            WIP
        </AppLayout>
    )
}