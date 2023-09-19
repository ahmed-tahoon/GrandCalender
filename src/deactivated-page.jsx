import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export default function DeactivatedPage() {
  const { user } = useLoaderData();

  // Set page title
  useEffect(() => {
    document.title = 'Deactivated';
  }, []);

  function clearStorage() {
    localStorage.removeItem("login_token");
    window.location.href = '/login';
  }

  return (
      <main className="min-h-[100vh] grid place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Oops!</h1>
            <p className="mt-4 text-base font-semibold text-grandkit-600">Sorry, you has been deactivated.</p>
            <p className="mt-6 text-base leading-7 text-gray-600">Reason: {user.suspended_reason}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                  onClick={clearStorage}
                  className="rounded-md bg-grandkit-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-grandkit-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
                >
                Logout
              </button>
              <a href={'mailto:'+import.meta.env.VITE_APP_CONTACT_EMAIL} className="text-sm font-semibold text-gray-900">
                Contact support <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </main>
    );
}