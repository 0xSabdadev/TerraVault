import Web3 from 'web3'
import {useEffect, useState} from 'react'
import data1 from '../../../build/contracts/ThresholdSignature.json' assert {type: 'json'}
import {toast} from 'sonner'

export default function FormTf({
    user,
    loadAccountsTables,
    loadPendingTransfers,
    loadBlockchainData,
}) {
    const [tfAmount, setTfAmount] = useState('')
    const [receiverAddr, setReceiverAddr] = useState('')

    const [loadingTf, setLoadingTf] = useState(false)
    const [loadingCancel, setLoadingCancel] = useState(false)

    // tx
    const [cancelId, setCancelId] = useState('')
    const [txHash, setTxHash] = useState('')

    const [currentSelectedWallet, setCurrentSelectedWallet] = useState('')

    useEffect(() => {
        const retrievedUserWalletObject = localStorage.getItem('userWalletObject')
        setCurrentSelectedWallet(retrievedUserWalletObject)
    }, [])

    const createTransferRequest = async () => {
        try {
            setLoadingTf(true)
            console.log('m:' + tfAmount + 'b:' + receiverAddr)
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

            const message = web3.utils.soliditySha3(
                {t: 'string', v: 'ETH'},
                {t: 'address', v: receiverAddr},
                {t: 'uint256', v: web3.utils.toWei(tfAmount.toString(), 'ether')},
            )

            const signature = await web3.eth.personal.sign(message, user.address, '')

            const tx = await contractInstance.methods
                .createTransferRequest(
                    'ETH',
                    receiverAddr,
                    web3.utils.toWei(tfAmount.toString(), 'ether'),
                    signature,
                )
                .send({from: user.address, gas: 900000}) // Sesuaikan dengan kebutuhan

            toast.success('TF Created successful!')
            loadBlockchainData(currentSelectedWallet)
            loadPendingTransfers(currentSelectedWallet)
            loadAccountsTables(currentSelectedWallet, 'transferCreated')
        } catch (error) {
            console.error('Error during create tf:' + error, error)
            toast.error('User denied the transaction or other error occurred.')
        } finally {
            setLoadingTf(false)
        }
    }

    const cancelTransferRequest = async () => {
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
        }
    }

    return (
        <div className='flex flex-col md:flex-row justify-between mb-12'>
            <div className='w-full md:w-1/2 max-h-96 bgGlassmorphismBlur rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
                <div className='p-6 space-y-4 md:space-y-6 sm:p-8 '>
                    <h1 className='text-xl font-bold leading-tight tracking-tight text-purplemain md:text-2xl dark:text-white'>
                        Create Transfer
                    </h1>
                    <form action='#'>
                        <div className='mb-6'>
                            <label
                                htmlFor='receiver_address'
                                className='block mb-2 text-md font-medium text-purplemain dark:text-white'>
                                Receiver Address
                            </label>
                            <input
                                value={receiverAddr}
                                onChange={e => setReceiverAddr(e.target.value)}
                                type='text'
                                name='receiver_address'
                                id='receiver_address'
                                className='bg-purplelight border border-lightmain-300 text-purplemain sm:text-sm rounded-lg focus:ring-purplemain focus:border-purplemain block w-full p-2.5 '
                                placeholder='address'
                                required=''
                            />
                        </div>
                        <div className='mb-6'>
                            <label
                                htmlFor='create_tf_amount'
                                className='block mb-2 text-md font-medium text-purplemain dark:text-white'>
                                Amount
                            </label>
                            <input
                                value={tfAmount}
                                onChange={e => setTfAmount(e.target.value)}
                                type='number'
                                name='create_tf_amount'
                                id='create_tf_amount'
                                className='bg-purplelight border border-lightmain-300 text-purplemain sm:text-sm rounded-lg focus:ring-purplemain focus:border-purplemain block w-full p-2.5 '
                                placeholder='amount'
                                required=''
                            />
                        </div>

                        <button
                            onClick={createTransferRequest}
                            disabled={loadingTf}
                            type='button'
                            className='w-full text-white bg-purplemain hover:bg-gradient-to-r from-purpledark to-orange font-medium rounded-lg text-md px-5 py-2.5 text-center '>
                            {loadingTf ? (
                                <div className='flex justify-center items-center text-center'>
                                    <svg
                                        aria-hidden='true'
                                        role='status'
                                        className='w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600'
                                        viewBox='0 0 100 101'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                            fill='currentColor'
                                        />
                                        <path
                                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                            fill='#1C64F2'
                                        />
                                    </svg>
                                    Creating...
                                </div>
                            ) : (
                                <div>Create Transfer</div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <div className='w-full md:w-1/2 max-h-96 bgGlassmorphismBlur rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
                <div className='p-6 space-y-4 md:space-y-6 sm:p-8 '>
                    <h1 className='text-xl font-bold leading-tight tracking-tight text-purplemain md:text-2xl dark:text-white'>
                        Cancel Transfer
                    </h1>
                    <form action='#'>
                        <div className='mb-6'>
                            <label
                                htmlFor='tx_hash'
                                className='block mb-2 text-md font-medium text-purplemain dark:text-white'>
                                Transaction Hash
                            </label>
                            <input
                                value={txHash}
                                onChange={e => setTxHash(e.target.value)}
                                type='text'
                                name='tx_hash'
                                id='tx_hash'
                                className='bg-purplelight border border-lightmain-300 text-purplemain sm:text-sm rounded-lg focus:ring-purplemain focus:border-purplemain block w-full p-2.5 '
                                placeholder='tx hash'
                                required=''
                            />
                        </div>
                        <div className='mb-6'>
                            <label
                                htmlFor='transfer_id'
                                className='block mb-2 text-md font-medium text-purplemain dark:text-white'>
                                Transfer ID
                            </label>
                            <input
                                value={cancelId}
                                onChange={e => setCancelId(e.target.value)}
                                type='number'
                                name='transfer_id'
                                id='transfer_id'
                                className='bg-purplelight border border-lightmain-300 text-purplemain sm:text-sm rounded-lg focus:ring-purplemain focus:border-purplemain block w-full p-2.5 '
                                placeholder='transfer id'
                                required=''
                            />
                        </div>

                        <button
                            onClick={cancelTransferRequest}
                            disabled={loadingCancel}
                            type='button'
                            className='w-full text-white bg-purplemain hover:bg-gradient-to-r from-purpledark to-orange font-medium rounded-lg text-md px-5 py-2.5 text-center '>
                            {loadingCancel ? (
                                <div className='flex justify-center items-center text-center'>
                                    <svg
                                        aria-hidden='true'
                                        role='status'
                                        className='w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600'
                                        viewBox='0 0 100 101'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                            fill='currentColor'
                                        />
                                        <path
                                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                            fill='#1C64F2'
                                        />
                                    </svg>
                                    Cancelling...
                                </div>
                            ) : (
                                <div>Cancel Transfer</div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
