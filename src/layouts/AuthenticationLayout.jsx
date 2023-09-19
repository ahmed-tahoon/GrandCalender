import coverImage from 'assets/cover.jpg'

export default function AuthenticationLayout(props) {
    return (
        <div className="h-[100vh] bg-white">
            <div className="flex min-h-full">
                {/* check props.children */}
                <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-[500px]">
                        {props.children}
                    </div>
                </div>
                <div className="relative hidden w-0 flex-1 lg:block">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={coverImage}
                        alt=""
                    />
                </div>
            </div>
        </div>
    )
}
