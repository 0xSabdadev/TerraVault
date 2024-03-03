import Web3 from 'web3'
import {useEffect, useState} from 'react'
import data1 from '../../../build/contracts/MultiSigTA.json' assert {type: 'json'}
import {toast} from 'sonner'
import ModalPending from './ModalPending'

export default function HistoryPending({
    listPending,
    listCreated,
    user,
    loadAccountsTables,
    loadPendingTransfers,
    loadBlockchainData,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [idTx, setIdTx] = useState('')

    const [loadingCancel, setLoadingCancel] = useState(false)
    const [loadingApprove, setLoadingApprove] = useState(false)
    const [cancelId, setCancelId] = useState('')
    const [approveId, setApprovelId] = useState('')
    const [txHash, setTxHash] = useState('')
    const [currentSelectedWallet, setCurrentSelectedWallet] = useState('')

    useEffect(() => {
        const retrievedUserWalletObject = localStorage.getItem('userWalletObject')
        setCurrentSelectedWallet(retrievedUserWalletObject)
        setIsModalOpen(false)
    }, [])

    const openModal = event => {
        const clickedButtonId = event.target.id
        setIdTx(clickedButtonId)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const cancelTransferRequest = async cancelId => {
        try {
            setLoadingCancel(true)
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data1.networks?.[networkId]

            if (!networkData) {
                toast.error('Contract Multisig not deployed to detected network.')
                return
            }

            const contractInstance = new web3.eth.Contract(data1.abi, currentSelectedWallet, {
                from: user.address,
            })

            const cancel = await contractInstance.methods
                .cancelTransferRequest('ETH', cancelId)
                .send({from: user.address})
            toast.success('TF Cancel successful!')
            loadPendingTransfers(currentSelectedWallet)
            loadAccountsTables(currentSelectedWallet, 'transferCreated')
            loadAccountsTables(currentSelectedWallet, 'transferCancelled')
            loadBlockchainData(currentSelectedWallet)
        } catch (error) {
            console.error('Error during cancel tf:', error)
            toast.error('User denied the transaction.')
        } finally {
            setLoadingCancel(false)
            setIsModalOpen(false)
        }
    }

    const approveTransferRequest = async approveId => {
        try {
            setLoadingApprove(true)
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data1.networks?.[networkId]

            if (!networkData) {
                toast.error('Contract Multisig not deployed to detected network.')
                return
            }

            const contractInstance = new web3.eth.Contract(data1.abi, currentSelectedWallet, {
                from: user.address,
            })
            const messageToSign = web3.utils.soliditySha3(
                {type: 'address', value: currentSelectedWallet},
                {type: 'uint256', value: approveId},
            )
            // Sign the message
            const signature = await web3.eth.personal.sign(
                web3.utils.utf8ToHex(messageToSign),
                user.address, // Signing account
                '',
            )
            const cancel = await contractInstance.methods
                .approveTransferRequest('ETH', approveId, signature)
                .send({from: user.address})
            toast.success('Approval successful!')
            loadPendingTransfers(currentSelectedWallet)
            loadAccountsTables(currentSelectedWallet, 'transferCreated')
            loadAccountsTables(currentSelectedWallet, 'transferApproved')
            loadBlockchainData(currentSelectedWallet)
        } catch (error) {
            console.error('Error during approve tf:', error)
            toast.error('User denied the transaction.')
        } finally {
            setLoadingApprove(false)
            setIsModalOpen(false)
        }
    }

    return (
        <div className='pt-0 pb-0  mx-auto max-w-screen-xl  lg:pb-16  relative mb-3'>
            <h1 className='text-center  text-xl font-extrabold font-roboto tracking-tight leading-none text-lightmain-800  md:text-2xl dark:text-white mb-6'>
                Pending Transactions
            </h1>
            <div className='relative overflow-x-auto  sm:rounded-lg'>
                <table className='font-roboto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                    <thead className='text-md text-white uppercase bg-purplemain dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>
                                Token
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Receiver Address
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Sender Address
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Amount
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                <span className='sr-only'>Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(listPending) ? (
                            listPending.reverse().map((wallet, idx) => (
                                <tr
                                    key={idx}
                                    className='rounded-lg bgGlassmorphismBlury dark:bg-gray-800 dark:border-gray-700  dark:hover:bg-gray-600'>
                                    <th
                                        scope='row'
                                        className='rounded-l-xl px-6 py-4 font-medium text-purplemain whitespace-nowrap dark:text-white'>
                                        {wallet.ticker}
                                    </th>

                                    <td className=' py-4 font-medium text-white whitespace-nowrap dark:text-white'>
                                        <span className='bgGradient text-white rounded-full  px-3 py-2'>
                                            {wallet.receiver}
                                        </span>
                                    </td>
                                    <td className=' py-4 font-medium text-white whitespace-nowrap dark:text-white'>
                                        <span className='bgGradient text-white rounded-full  px-3 py-2'>
                                            {wallet.sender}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4  text-purplemain dark:text-white'>
                                        {(wallet.amount / 10 ** 18).toFixed(2)}
                                    </td>
                                    <td className=' rounded-r-xl px-6 py-4 text-right'>
                                        <button
                                            onClick={openModal}
                                            id={wallet.id}
                                            className='font-medium text-purplemain dark:text-blue-500 hover:underline'>
                                            Approve
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
            <ModalPending
                isOpen={isModalOpen}
                onClose={closeModal}
                idTx={idTx}
                listHist={listPending}
                listCreated={listCreated}
                header={'Pending Tx'}
                cancelTransferRequest={cancelTransferRequest}
                approveTransferRequest={approveTransferRequest}
                user={user}
            />
        </div>
    )
}
