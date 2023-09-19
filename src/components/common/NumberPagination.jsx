export default function Pagination(props) {
    const { paginationMeta = [], reloadData } = props

    function getPageFromLabel(label) {
        // When click on 'Previous' button
        if(label === '&laquo; Previous') {
            if(paginationMeta.current_page > 1) {
                return paginationMeta.current_page - 1
            }
            return 1
        }

        if(label === 'Next &raquo;') {
            if(paginationMeta.current_page < paginationMeta.last_page) {
                return paginationMeta.current_page + 1
            }
            return paginationMeta.last_page
        }
        return parseInt(label)
    }

    function getLabel(label) {
        if(label === 'pagination.previous') {
            return '&laquo; Previous'
        }
        if(label === 'pagination.next') {
            return 'Next &raquo;'
        }
        return label
    }

    return (
        <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mb-6">
            <div className="-mt-px w-0 flex-1 flex"></div>
            <div className="md:-mt-px md:flex">
                {paginationMeta.links.map((paginationLink) => (<button
                    key={paginationLink.label}
                    className={(paginationLink.active ? 'border-grandkit-500 text-grandkit-600' : 'border-transparent text-gray-500') +' hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'}
                    dangerouslySetInnerHTML={ {__html: getLabel(paginationLink.label)} }
                    onClick={() => reloadData('page', getPageFromLabel(paginationLink.label))}
                ></button>))}

            </div>
            <div className="-mt-px w-0 flex-1 flex justify-end mr-5"></div>
        </nav>
    )
}
