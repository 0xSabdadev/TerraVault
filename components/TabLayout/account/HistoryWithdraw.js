import {useState} from 'react'
import ModalDepo from './ModalDepo'

export default function HistoryWithdraw({listWith}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [idTx, setIdTx] = useState('')

    const openModal = event => {
        const clickedButtonId = event.target.id
        setIdTx(clickedButtonId)
        setIsModalOpen(true)
    }
    const reversedList = [...listWith].reverse()

    const closeModal = () => {
        setIsModalOpen(false)
    }
    return (
        <div className='pt-0 pb-0  mx-auto max-w-screen-xl  lg:pb-16  relative'>
            <h1 className='text-center  text-xl font-extrabold font-roboto tracking-tight leading-none text-lightmain-800  md:text-2xl dark:text-white mb-6'>
                Withdrawal History
            </h1>
            <div className='relative overflow-x-auto  sm:rounded-lg'>
                <table className='font-roboto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                    <thead className='text-md text-white uppercase bg-purplemain dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>
                                Token
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Tx ID
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Withdrawed By
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Amount
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Date
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                <span className='sr-only'>Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(listWith) ? (
                            reversedList.map((wallet, idx) => (
                                <tr
                                    key={idx}
                                    className='rounded-lg bgGlassmorphismBlury dark:bg-gray-800 dark:border-gray-700  dark:hover:bg-gray-600'>
                                    <th
                                        scope='row'
                                        className='rounded-l-xl px-6 py-4 font-medium text-purplemain whitespace-nowrap dark:text-white'>
                                        {wallet.returnValues.ticker}
                                    </th>
                                    <td className='px-6 py-4 text-purplemain'>
                                        {wallet.returnValues.withdrawalId}
                                    </td>
                                    <td className='px-6 py-4 font-medium text-white whitespace-nowrap dark:text-white'>
                                        <span className='bgGradient  text-white rounded-full  px-3 py-2'>
                                            {wallet.returnValues.sender}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4  text-purplemain dark:text-white'>
                                        {(wallet.returnValues.amount / 10 ** 18).toFixed(2)}
                                    </td>
                                    <td className='px-6 py-4 text-purplemain'>
                                        {new Date(
                                            wallet.returnValues.timeOfTransaction * 1000,
                                        ).toLocaleString('en-US', {
                                            timeZone: 'Asia/Jakarta',
                                        })}
                                    </td>
                                    <td className=' rounded-r-xl px-6 py-4 text-right'>
                                        <button
                                            onClick={openModal}
                                            id={idx}
                                            className='font-medium text-purplemain dark:text-blue-500 hover:underline'>
                                            Details
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
            <ModalDepo
                isOpen={isModalOpen}
                onClose={closeModal}
                idTx={idTx}
                listDepo={listWith}
                header={'Withdrawal'}
            />
        </div>
    )
}
