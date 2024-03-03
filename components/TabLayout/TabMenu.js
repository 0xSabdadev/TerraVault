export default function TabMenu() {
    return (
        <ul
            id='menu-tab'
            data-tabs-toggle='#menu-tab-content'
            role='tablist'
            className='font-roboto flex-column space-y space-y-4 text-md font-bold text-white dark:text-gray-400 md:me-4 mb-4 md:mb-0 '>
            <li role='presentation'>
                <button
                    id='admin-tab'
                    data-tabs-target='#admin'
                    type='button'
                    role='tab'
                    aria-controls='admin'
                    aria-selected='false'
                    className='inline-flex items-center px-4 py-3 text-white bg-purplemain rounded-lg active w-full focus:text-white focus:bg-gradient-to-r from-purpledark to-orange hover:text-white hover:bg-gradient-to-r from-purpledark to-orange'
                    aria-current='page'>
                    <svg
                        className='w-4 h-4 me-2 text-white'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z' />
                    </svg>
                    admin
                </button>
            </li>
            <li role='presentation'>
                <button
                    id='accounts-tab'
                    data-tabs-target='#accounts'
                    type='button'
                    role='tab'
                    aria-controls='accounts'
                    aria-selected='false'
                    className='inline-flex items-center px-4 py-3 text-white bg-purplemain rounded-lg active w-full focus:text-white focus:bg-gradient-to-r from-purpledark to-orange hover:text-white hover:bg-gradient-to-r from-purpledark to-orange'>
                    <svg
                        className='w-4 h-4 me-2 text-white'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 20 19'>
                        <path d='M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z' />
                        <path d='M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z' />
                    </svg>
                    accounts
                </button>
            </li>
            <li role='presentation'>
                <button
                    id='transfers-tab'
                    data-tabs-target='#transfers'
                    type='button'
                    role='tab'
                    aria-controls='transfers'
                    aria-selected='false'
                    className='inline-flex items-center px-4 py-3 text-white bg-purplemain rounded-lg active w-full focus:text-white focus:bg-gradient-to-r from-purpledark to-orange hover:text-white hover:bg-gradient-to-r from-purpledark to-orange'>
                    <svg
                        className='w-4 h-4 me-2 text-white'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 18 18'>
                        <path d='M15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783ZM6 2h6a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm7 5H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Z' />
                        <path d='M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z' />
                    </svg>
                    transfers
                </button>
            </li>
        </ul>
    )
}
