export default function Loader(props) {
    const { text = null, fullscreen = true } = props;

    return (
        <div className={(fullscreen ? "" : "ml-56" ) + " fullscreen-loading flex items-center justify-around"}>
            <div>
                <div className="grandizer-loader w-20 mx-auto"></div>
                {text && <div className="text-sm text-center mt-2">{text}</div>}
            </div>
        </div>
    );
}