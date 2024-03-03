import {useRouter} from 'next/router'

export default function WalletTable({dataOwner}) {
    const router = useRouter()
    const redirectWallet = id => {
        localStorage.setItem('userWalletObject', id)
        router.push('/wallet')
    }
    return (
        <section className='bgGradientBackgroundUp dark:bg-gray-900 '>
            <div className='pt-0 pb-8 px-4 mx-auto max-w-screen-xl text-left lg:pb-16  relative'>
                <div className='flex flex-row justify-between mb-8'>
                    <h1 className='text-left  text-lg font-extrabold font-roboto tracking-tight leading-none text-purplemain md:text-2xl lg:text-3xl dark:text-white'>
                        Wallet List
                    </h1>
                    <h1 className='text-left text-lg font-bold font-roboto tracking-tight leading-none text-purplemain md:text-lg lg:text-1xl dark:text-white'>
                        Total Wallets : <span className='text-purplemain'>{dataOwner.length}</span>
                    </h1>
                </div>

                <div className='relative overflow-x-auto  sm:rounded-lg'>
                    <table className='font-roboto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className='text-md text-lightmain-800 uppercase bg-purplemain dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th scope='col' className='px-6 py-3'>
                                    Wallet
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                    Wallet Address
                                </th>
                                <th scope='col' className='px-6 py-3'>
                                    <span className='sr-only'>Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(dataOwner) ? (
                                dataOwner.map((wallet, idx) => (
                                    <tr
                                        key={idx}
                                        className='rounded-lg bgGlassmorphismBlury dark:bg-gray-800 dark:border-gray-700 hover:bg-lightmain-800 dark:hover:bg-gray-600'>
                                        <th
                                            scope='row'
                                            className='rounded-l-xl px-6 py-4 font-medium text-purplemain whitespace-nowrap dark:text-white'>
                                            {idx + 1}
                                        </th>
                                        <td className='px-6 py-4 text-white'>
                                            <span className='bgGradient text-white rounded-full  px-3 py-2'>
                                                {wallet.walletAdress}
                                            </span>
                                        </td>
                                        <td className=' rounded-r-xl px-6 py-4 text-right'>
                                            <button
                                                id={wallet.walletAdress}
                                                onClick={() => redirectWallet(wallet.walletAdress)}
                                                className='font-medium text-purplemain dark:text-blue-500 hover:underline'>
                                                Access
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='3' className='px-6 py-4 text-white text-center'>
                                        Invalid data format
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
