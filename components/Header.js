import {getSession, signOut} from 'next-auth/react'
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useRouter} from 'next/router'

export default function Header({user, id = 'null', balance = 0.0, idr = 0.0}) {
    const cariBoro = menu => {
        const boroButton = document.querySelector(`#${menu}`)
        if (boroButton) {
            boroButton.click()
        } else {
            console.error('Element with ID "boro" not found')
        }
    }

    const router = useRouter()

    const redirectToHome = () => {
        router.push('/')
    }

    return (
        <nav className='bgGlassmorphismBlury dark:bg-gray-900 fixed w-full z-10 top-0 start-0   dark:border-gray-600'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
                <div className='flex justify-start items-center'>
                    <button onClick={redirectToHome} className='flex mr-4'>
                        <img
                            src='https://res.cloudinary.com/kabupaten-sukoharjo/image/upload/v1707048801/TerraVault_g8ijrz.png'
                            className='mr-3 h-8'
                            alt='Logo'
                        />
                    </button>
                </div>
                <div className='flex items-center lg:order-2'>
                    <button
                        type='button'
                        data-dropdown-toggle='notification-dropdown'
                        className='p-2 mr-1 text-purplemain rounded-lg hover:text-purpledark hover:bg-lightmain-300 focus:text-purpledark dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:text-purplemain dark:focus:ring-gray-600'>
                        <span className='sr-only'>View notifications</span>
                        <svg
                            className='w-5 h-5'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 512 512'>
                            <path d='M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V304v5.7V336zm32 0V304 278.1c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z' />
                        </svg>
                    </button>
                    <div
                        className='hidden overflow-hidden z-50 my-4 max-w-sm md:w-64 min-h-72 text-base list-none bgGlassmorphismWhite rounded divide-y divide-bgGlassmorphismWhite shadow-lg dark:divide-gray-600 dark:bg-gray-700 font-roboto border-b'
                        id='notification-dropdown'>
                        <div className='block py-2 px-4 text-md font-bold text-center text-white bgGradient dark:bg-gray-700 dark:text-gray-400'>
                            Balance
                        </div>
                        <div>
                            <div className=' py-3 px-4 hover:bg-lightmain-300 dark:hover:bg-gray-600 dark:border-gray-600'>
                                <div className='pl-1 flex flex-row justify-between w-full mb-8'>
                                    <button
                                        className='text-purplemain bg-lightmain-300 font-medium rounded-lg text-sm py-1 text-center inline-flex items-center '
                                        type='button'
                                        disabled>
                                        Wallet ID :{' '}
                                        <span className='text-purplemain ml-1'>{id}</span>
                                    </button>
                                    <button
                                        id='tokenDropdown'
                                        data-dropdown-toggle='token-dropdown'
                                        className='text-purplemain bg-dark font-medium rounded-lg text-sm px-3 py-1 text-center inline-flex items-center '
                                        type='button'>
                                        ETH{' '}
                                        <svg
                                            className='w-2.5 h-2.5 ms-3'
                                            aria-hidden='true'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 10 6'>
                                            <path
                                                stroke='currentColor'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='m1 1 4 4 4-4'
                                            />
                                        </svg>
                                    </button>

                                    <div
                                        id='token-dropdown'
                                        className='z-50 hidden bgGlassmorphismBlur divide-y divide-lightmain-800 rounded-lg  w-16 dark:bg-gray-700 mr-4'>
                                        <ul
                                            className='py-2 text-sm text-purplemain dark:text-gray-200'
                                            aria-labelledby='tokenDropdown'>
                                            <li>
                                                <a
                                                    href='#'
                                                    className='block px-4 py-2 hover:bg-lightmain-800 dark:hover:bg-gray-600 dark:hover:text-white'>
                                                    ETH
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href='#'
                                                    className='block px-4 py-2 hover:bg-lightmain-800 dark:hover:bg-gray-600 dark:hover:text-white'>
                                                    UNI
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href='#'
                                                    className='block px-4 py-2 hover:bg-lightmain-800 dark:hover:bg-gray-600 dark:hover:text-white'>
                                                    VET
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href='#'
                                                    className='block px-4 py-2 hover:bg-lightmain-800 dark:hover:bg-gray-600 dark:hover:text-white'>
                                                    DYT
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href='#'
                                                    className='block px-4 py-2 hover:bg-lightmain-800 dark:hover:bg-gray-600 dark:hover:text-white'>
                                                    BNB
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='pl-3 w-full mb-8'>
                                    <div className='text-purplemain font-normal text-center text-4xl mb-1.5 dark:text-gray-400'>
                                        {balance}
                                        <span className='ml-1 font-semibold text-purplemain dark:text-white'>
                                            ETH
                                        </span>
                                    </div>
                                    <div className='text-purplemain font-normal text-center text-1xl mb-1.5 dark:text-gray-400'>
                                        {idr}
                                        <span className='ml-1 font-semibold text-purplemain dark:text-white'>
                                            IDR
                                        </span>
                                    </div>
                                </div>
                                <div className='pl-1 flex flex-row justify-center w-full mb-5'>
                                    <button
                                        className='text-white bg-purplemain hover:bg-gradient-to-r from-purpledark to-orange rounded-lg text-md  text-center inline-flex items-center px-3 py-2 transition duration-300 delay-80'
                                        type='button'>
                                        View Transfer Requests
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        data-dropdown-toggle='apps-dropdown'
                        className='p-2 text-purplemain rounded-lg hover:text-purpledark hover:bg-darkwood focus:text-purpledark dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700  focus:bg-lightmain-300 dark:focus:ring-gray-600'>
                        <span className='sr-only'>View notifications</span>
                        <svg
                            className='w-4 h-4'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='currentColor'
                            viewBox='0 0 18 18'>
                            <path d='M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z' />
                        </svg>
                    </button>
                    <div
                        className='hidden overflow-hidden z-50 my-4 max-w-sm text-base list-none bgGlassmorphismWhite rounded divide-y divide-lightmain-800 shadow-lg dark:bg-gray-700 dark:divide-gray-600 font-roboto border-b'
                        id='apps-dropdown'>
                        <div className='block py-2 px-4 text-md font-bold text-center text-white bgGradient  dark:bg-gray-700 dark:text-gray-400'>
                            Menus
                        </div>
                        <div className='grid grid-cols-2 gap-4 p-4'>
                            <button
                                onClick={() => cariBoro('admin-tab')}
                                className='block p-4 text-center rounded-lg hover:bg-lightmain-300 dark:hover:bg-gray-600 group'>
                                <svg
                                    className='mx-auto mb-2 w-5 h-5 text-purplemain group-hover:text-purpledark dark:text-white dark:group-hover:text-white'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='currentColor'
                                    viewBox='0 0 448 512'>
                                    <path d='M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7H162.5c0 0 0 0 .1 0H168 280h5.5c0 0 0 0 .1 0H417.3c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2H224 204.3c-12.4 0-20.1 13.6-13.7 24.2z' />
                                </svg>
                                <div className='text-sm font-medium text-purplemain dark:text-white'>
                                    Admin
                                </div>
                            </button>
                            <button
                                onClick={() => cariBoro('accounts-tab')}
                                className='block p-4 text-center rounded-lg hover:bg-lightmain-300 dark:hover:bg-gray-600 group'>
                                <svg
                                    className='mx-auto mb-2 w-5 h-5 text-purplemain group-hover:text-purpledark dark:text-white dark:group-hover:text-white'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='currentColor'
                                    viewBox='0 0 20 19'>
                                    <path d='M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z' />
                                    <path d='M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z' />
                                </svg>
                                <div className='text-sm font-medium text-purplemain dark:text-white'>
                                    Accounts
                                </div>
                            </button>
                            <button
                                onClick={() => cariBoro('transfers-tab')}
                                className='block p-4 text-center rounded-lg hover:bg-lightmain-300 dark:hover:bg-gray-600 group'>
                                <svg
                                    className='mx-auto mb-2 w-5 h-5 text-purplemain group-hover:text-purpledark dark:text-white dark:group-hover:text-white'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='currentColor'
                                    viewBox='0 0 18 18'>
                                    <path d='M15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783ZM6 2h6a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm7 5H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Z' />
                                    <path d='M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z' />
                                </svg>
                                <div className='text-sm font-medium text-purplemain dark:text-white'>
                                    Transfers
                                </div>
                            </button>
                            <button
                                onClick={() => redirectToHome()}
                                className='block p-4 text-center rounded-lg hover:bg-lightmain-300 dark:hover:bg-gray-600 group'>
                                <svg
                                    className='mx-auto mb-2 w-5 h-5 text-purplemain group-hover:text-purpledark dark:text-white dark:group-hover:text-white'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='currentColor'
                                    viewBox='0 0 512 512'>
                                    <path d='M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z' />
                                </svg>
                                <div className='text-sm font-medium text-purplemain dark:text-white'>
                                    Wallets
                                </div>
                            </button>
                        </div>
                    </div>
                    <button
                        type='button'
                        className='flex mx-3 text-sm bg-lightmain-300 rounded-full md:mr-0 focus:ring-2 focus:ring-purplemain dark:focus:ring-gray-600'
                        id='user-menu-button'
                        aria-expanded='false'
                        data-dropdown-toggle='dropdown'>
                        <span className='sr-only'>Open user menu</span>
                        <img
                            className='w-8 h-8 rounded-full'
                            src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                            alt='user photo'
                        />
                    </button>
                    <div
                        className='hidden z-50 my-4 w-56 text-base list-none font-roboto bgGlassmorphismWhite rounded  shadow dark:bg-gray-700 dark:divide-gray-600 border-b'
                        id='dropdown'>
                        <div className='py-3 px-4'>
                            <span className='block text-md font-semibold  bg-gradient-to-r from-purpledark to-orange text-transparent bg-clip-text dark:text-white'>
                                Address
                            </span>
                            <span className='block text-md text-purplemain truncate dark:text-gray-400'>
                                {user.address}
                            </span>
                        </div>

                        <ul
                            className='py-1  dark:text-gray-400 text-red-600'
                            aria-labelledby='dropdown'>
                            <li>
                                <button
                                    onClick={() => signOut({redirect: '/signin'})}
                                    className='block py-2 px-4 text-md hover:bg-darkwood  dark:hover:bg-gray-600 dark:hover:text-white'>
                                    <i className='fa-solid fa-power-off mr-2'></i>Sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}
