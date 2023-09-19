export default function Error(props) {
    const { error } = props;

    return (
        <div className="fullscreen-loading flex items-center justify-around text-gray-600 p-20">
            <div className="text-center">
                <p>Oops! We're Sorry for the Inconvenience.</p>
                <p>Error Message: {error.message}</p>
                <p><a href={window.location.href} className="font-medium underline text-grandkit-500">Click here to try again</a></p>
            </div>
        </div>
    );
}