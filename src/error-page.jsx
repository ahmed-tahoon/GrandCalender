import { useEffect } from "react";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  function clearStorage() {
    localStorage.removeItem("login_token");
    window.location.reload();
  }

  // Set page title
  useEffect(() => {
    document.title = 'Error!';
  }, []);

  return (
    <main className="min-h-[100vh] grid place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Oops! </h1>
          <p className="mt-4 text-base font-semibold text-grandkit-600">Sorry, an unexpected error has occurred.</p>
          <p className="mt-6 text-base leading-7 text-gray-600">Status: {error.statusText || error.message}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-grandkit-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-grandkit-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grandkit-600"
            >
              Go back home
            </Link>
            <button onClick={clearStorage} className="text-sm font-semibold text-gray-900">
              Still error? Click here to clear browser cache <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </main>
  );
}