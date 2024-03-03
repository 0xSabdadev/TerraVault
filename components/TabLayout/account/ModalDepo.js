import Web3 from 'web3'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import data1 from '../../../build/contracts/MultiSigTA.json' assert {type: 'json'}
import {toast} from 'sonner'

export default function ModalDepo({isOpen, onClose, idTx, listDepo, header}) {
    const [txDetails, setTxDetails] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                if (!listDepo[idTx] || !listDepo[idTx].transactionHash) {
                    throw new Error('Transaction data not available.')
                }

                const web3 = new Web3(window.web3.currentProvider)
                const networkId = await web3.eth.net.getId()
                const networkData = data1.networks[networkId]

                if (!networkData) {
                    toast.error('Contract Multisig not deployed to detected network.')
                    return
                }

                const txDetail = await web3.eth.getTransaction(listDepo[idTx].transactionHash)
                setTxDetails(txDetail)
            } catch (error) {
                if (error.message !== 'Transaction data not available.') {
                    console.error('Error loading Tx details: ' + error)
                    toast.error('Error loading Tx details')
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
        // console.log('tex' + listDepo[0].transactionHash)
    }, [idTx])

    return (
        <>
            {isOpen && (
                <div className='flex fixed z-30 top-0 left-0 w-full h-full justify-center items-center bg-[#00000080]'>
                    <div
                        className='relative p-4 w-full max-w-2xl max-h-full'
                        onClick={e => e.stopPropagation()}>
                        <div className='relative bgGradientBackgroundUp rounded-lg shadow '>
                            <div className='flex items-center justify-between p-4 md:p-5  rounded-t dark:border-gray-600'>
                                <h3 className='text-lg font-semibold text-purplemain dark:text-white'>
                                    <i className='fa-solid fa-circle-info fa-beat mr-3 text-red-600'></i>
                                    {header} Details
                                </h3>
                                <button
                                    onClick={onClose}
                                    type='button'
                                    className='text-red-600 bg-transparent hover:bg-lightmain-800 hover:text-red-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'>
                                    <svg
                                        className='w-3 h-3'
                                        aria-hidden='true'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 14 14'>
                                        <path
                                            stroke='currentColor'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                                        />
                                    </svg>
                                    <span className='sr-only'>Close modal</span>
                                </button>
                            </div>
                            <div className='p-4 md:p-5 space-y-4'>
                                {!isLoading ? (
                                    <>
                                        <button className='px-3 py-3 rounded-full bgGradient mb-3 text-sm font-bold w-full text-center text-white'>
                                            <p>{listDepo[idTx].transactionHash}</p>
                                        </button>
                                        <table className='font-roboto w-full text-sm text-left rtl:text-right text-purplemain dark:text-gray-400 border  border-purplemain'>
                                            <tbody>
                                                <tr className='border-b border-purplemain'>
                                                        <td className='py-2 px-4'>TimeStamp</td>
                                                        <td className='py-2 px-4'>
                                                            :{' '}
                                                            {new Date(
                                                                listDepo[idTx].returnValues.timeOfTransaction * 1000,
                                                            ).toLocaleString('en-US', {
                                                                timeZone: 'Asia/Jakarta',
                                                            })}
                                                        </td>
                                                </tr>
                                                <tr className='border-b border-purplemain'>
                                                    <td className='py-2 px-4'>Block Hash</td>
                                                    <td className='py-2 px-4'>
                                                        :{' '}
                                                        {listDepo[idTx].blockHash.slice(0, 36) +
                                                            '...'}
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-purplemain'>
                                                    <td className='py-2 px-4'>Block Number</td>
                                                    <td className='py-2 px-4'>
                                                        : {listDepo[idTx].blockNumber}
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-purplemain'>
                                                    <td className='py-2 px-4'>TX Signature</td>
                                                    <td className='py-2 px-4'>
                                                        :{' '}
                                                        {listDepo[idTx].signature.slice(0, 36) +
                                                            '...'}
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-purplemain'>
                                                    <td className='py-2 px-4'>TX Nonce</td>
                                                    <td className='py-2 px-4'>
                                                        : {txDetails.nonce}
                                                    </td>
                                                </tr>
                                                <tr className='border-b border-purplemain'>
                                                    <td className='py-2 px-4'>Gas Used</td>
                                                    <td className='py-2 px-4'>: {txDetails.gas}</td>
                                                </tr>
                                                <tr className='border-b border-purplemain'>
                                                    <td className='py-2 px-4'>Gas Price</td>
                                                    <td className='py-2 px-4'>
                                                        : {txDetails.gasPrice}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>
                                ) : (
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
                                        Fetching Data...
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center justify-center p-4 md:p-5 rounded-b dark:border-gray-600'>
                                <button
                                    onClick={onClose}
                                    type='button'
                                    className='text-red-600 bg-lightmain-800 hover:bg-red-600 hover:text-white  font-medium rounded-lg text-sm px-5 py-2.5 text-center '>
                                    Close 
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
