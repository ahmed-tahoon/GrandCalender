import { useEffect, useState } from "react";
import AppLayout from "layouts/AppLayout";
import SideBar from "components/features/settings/SideBar";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import TimezoneSelectField from "components/fields/TimezoneSelectField";
import AvailabilityField from "components/fields/AvailabilityField";
import TextField from "components/fields/TextField";
import { toast } from "react-toastify";
import ZoomSVG from "assets/integrations/zoom.svg";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/20/solid";
import { use } from "i18next";
import AlertModal from "components/common/AlertModal";

const loginToken = localStorage.getItem("login_token");
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
axios.defaults.baseURL = apiEndpoint;
axios.defaults.headers.common = { Authorization: `Bearer ${loginToken}` };

export default function index() {
    const { user } = useLoaderData();
    let navigate = useNavigate();
    const [linkText, setLinkText] = useState("");
    const [link, setLink] = useState("");
    const [deleteModelModalOpen, setDeleteModelModalOpen] = useState(false)
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        document.title = "Zoom Meeting";
    }, []);
useEffect(()=>{
    console.log(user)

},[user])
    /**
     * Disconnect to Google Calendar api
     */
    const disconnectFromDriver = async () => {
        try {
            const response = await axios.delete(`/api/oauth2/zoom/disconnect/${provider.id}`);
            const { data } = response;
            console.log(data);
            if (data.status == 200) {
                toast.success(data.message);
                // redload page
                window.location.reload();
            }
        } catch (error) {
            const { data } = error.response.data;
            if (data.status == 400) {
                toast.error(data.message);
            }
        }
    };

    const checkIfUserIsConnected = () => {
        return user.providers.some((provider) => provider.provider === "zoom");
    };

    const provider =  user.providers.find((provider) => provider.provider === "zoom");
    const [isEditing, setIsEditing] = useState(false);
    const [editedLinkText, setEditedLinkText] = useState(linkText);
  
    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleSaveClick = async() => {

       
          setValidationError(""); // Clear the validation error message
      // Call the onEdit function with the updated link text
    await  axios.post(`/api/oauth2/zoom/connect/ZOOM`,{provider_id:editedLinkText,provider:"zoom"})
      .then((response) => {
        console.log(response)
        window.location.reload();

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    };
    useEffect(()=>{
        setLinkText(provider?.provider_id)
        setLink(provider?.provider_id)
        setEditedLinkText(provider?.provider_id)
    },[provider])
  
    const handleCancelClick = () => {
      setIsEditing(false);
      setValidationError(""); // Clear the validation error message
      // Reset the edited link text to the original link text
      setEditedLinkText(linkText);
    };
  
    const handleInputChange = (e) => {
      setEditedLinkText(e.target.value);
    };

    const isValidUrl = (url) => {
        // Define a regular expression pattern to match the Zoom URL format
        const zoomUrlRegex = /^https:\/\/zoom\.us\/j\/[A-Za-z0-9]+$/;
        return zoomUrlRegex.test(url);
      };
      
    return (
        <AppLayout user={user} sideBar={<SideBar />}>
            <div>
            <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 uppercase flex">
                        <img src={ZoomSVG} className="h-6 w-6 mr-2" />
                        Accessing Your Zoom Personal Meeting Room
                    </h2>
                   
                </div>
              

                <div className="mt-8 p-6 bg-white ">
        
        <div className="grid grid-cols-2 gap-6">
          {/* Step 1 */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-blue-500">
              </span>
              <p className="font-semibold text-gray-700">Step 1:</p>
            </div>
            <p className="text-gray-600">
              Go to the Zoom web portal and sign in to your account.
            </p>
            <a
              href="https://zoom.us/signin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Zoom Sign In
            </a>
          </div>

          {/* Step 2 */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-blue-500 ">
              </span>
              <p className="font-semibold text-gray-700">Step 2:</p>
            </div>
            <p className="text-gray-600">
              Navigate to the "Meetings" section.
            </p>
          </div>
        </div>
        <AlertModal
            title="Delete Link"
            note={`Are you sure you want to delete this link?`}
            confirm={disconnectFromDriver}
            close={() => setDeleteModelModalOpen(false)}
            open={deleteModelModalOpen}
        />
        {/* Personal Meeting Room Link */}
        <div className="mt-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-blue-500 ">
              </span>
              <p className="font-semibold text-gray-700">Step 3:</p>
            </div>
            <p className="text-gray-600">
              Under the "Personal Meeting ID" section, you will see your Personal Meeting Room link.
              The link usually looks something like this: https://zoom.us/j/YourPersonalMeetingID
            </p>
          </div>
        </div>



        <div className="flex items-center mt-6 border rounded-lg p-4">
      {checkIfUserIsConnected() &&!isEditing ? (
        <>
    <span className="text-gray-500">{provider.provider_id}</span>   
        </>
      ) : (
        <>
          {isEditing ? (
   <div/>

          ) : (
            <>
              <span className="text-gray-500">Please add here</span>
            </>
          )}
        </>
      )}
      {isEditing ? (
        <>
         <input
            type="text"
            value={editedLinkText}
            onChange={handleInputChange}
            className="border rounded mr-2 px-2 py-1"
          />
          <button
            onClick={handleSaveClick}
            className="text-grandkit-500 hover:text-grandkit-700 mr-2"
          >
            Save
          </button>
          <button
            onClick={handleCancelClick}
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            Cancel
          </button>
          <p className="text-red-500">{validationError}</p> {/* Validation error message */}

        </>
      ) : (
        <>
          {link && (
            <>
              <button
                onClick={handleEditClick}
                className="text-blue-500 hover:text-blue-700 mr-1 ml-2"
              >
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-500" >
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
</svg>

              </button>
              <button
                onClick={() => setDeleteModelModalOpen(true)}
                className="text-red-500 hover:text-red-700"
              >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>
              </button>
            </>
          )}
          {!link && !isEditing && (
            <button
              onClick={handleEditClick}
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 ">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
            </button>
          )}
        </>
      )}
    </div>
      </div>

      

            </div>
        </AppLayout>
    );
}
