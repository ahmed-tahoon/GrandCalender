import { useEffect } from "react";
import List from "components/features/availability/List";
import SectionHeading from "components/features/availability/SectionHeading";
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { useLoaderData } from "react-router-dom";

export default function Availability() {
    const { user } = useLoaderData();

    // Set page title
    useEffect(() => {
        document.title = 'Availability';
    }, []);
    
    return (
        <AppLayout user={user} sideBar={<SideBar />}>
            <SectionHeading user={user} />
            <List user={user} />
        </AppLayout>
    )
}