export default function SkeletonTable(props) {
    const { cols = 4, rows = 15 } = props
    return (<div className="bg-white">
        <ul role="list" className="animate-pulse divide-y divide-gray-200">
            {[...Array(rows)].map((x, i) => (<li key={i}>
                <div className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded bg-gray-200"></div>
                            </div>
                            <div className={'min-w-0 flex-1 px-4 md:grid md:gap-4 md:grid-cols-'+(cols+1)}>
                                <div>
                                    <div className="text-sm font-medium text-gray-600 bg-gray-200 truncate cursor-pointer rounded">&nbsp;</div>
                                    <div className="mt-2 flex items-center text-xs text-gray-500 bg-gray-200 rounded">&nbsp;</div>
                                </div>
                                {[...Array(cols)].map((y, u) => (<div key={u} className="hidden md:block">
                                    <div className="pt-2">
                                        <div className="bg-gray-200 rounded">&nbsp;</div>
                                    </div>
                                </div>))}
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-200 w-10 rounded">&nbsp;</div>
                        </div>
                    </div>
                </div>
            </li>))}
        </ul>
        <div className="md:grid-cols-1 sr-only"></div>
        <div className="md:grid-cols-2 sr-only"></div>
        <div className="md:grid-cols-3 sr-only"></div>
        <div className="md:grid-cols-4 sr-only"></div>
        <div className="md:grid-cols-5 sr-only"></div>
        <div className="md:grid-cols-6 sr-only"></div>
        <div className="md:grid-cols-7 sr-only"></div>
        <div className="md:grid-cols-8 sr-only"></div>
        <div className="md:grid-cols-9 sr-only"></div>
        <div className="md:grid-cols-10 sr-only"></div>
        <div className="md:grid-cols-11 sr-only"></div>
        <div className="md:grid-cols-12 sr-only"></div>
    </div>)
}