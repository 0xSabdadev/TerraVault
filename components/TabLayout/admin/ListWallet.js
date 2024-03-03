import Web3 from 'web3'
import {useEffect, useState} from 'react'
import data1 from '../../../build/contracts/MultiSigTA.json' assert {type: 'json'}
import {toast} from 'sonner'

export default function ListWallet({list, user, addr, loadWalletOwners}) {
    const [currentSelectedWallet, setCurrentSelectedWallet] = useState('')

    useEffect(() => {
        const retrievedUserWalletObject = localStorage.getItem('userWalletObject')
        setCurrentSelectedWallet(retrievedUserWalletObject)
    }, [])

    const removeUserById = async id => {
        try {
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

            const removed = await contractInstance.methods
                .removeWalletOwner(id, addr, currentSelectedWallet)
                .send({from: user.address})

            toast.success('Wallet owner has been removed')
            loadWalletOwners(currentSelectedWallet)
        } catch (error) {
            console.error('Error during removeUser:', error)
            toast.error('An error occurred during user addition.')
        }
    }
    return (
        <div className='pt-0 pb-0  mx-auto max-w-screen-xl  lg:pb-16 z-10 relative'>
            <h1 className='text-center  text-xl font-extrabold font-roboto tracking-tight leading-none text-lightmain-800   md:text-2xl dark:text-white mb-6'>
                Wallet Owners
            </h1>

            <div className='relative overflow-x-auto  sm:rounded-lg'>
                <table className='font-roboto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                    <thead className='text-md text-white uppercase bg-purplemain dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>
                                Wallet Address
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Name
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                <span className='sr-only'>Remove</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(list) ? (
                            list.map((wallet, idx) => (
                                <tr
                                    key={idx}
                                    className='rounded-lg bgGlassmorphismBlury dark:bg-gray-800 dark:border-gray-700  dark:hover:bg-gray-600'>
                                    <th
                                        scope='row'
                                        className='rounded-l-xl px-6 py-4 font-medium text-white whitespace-nowrap dark:text-white'>
                                        <span className='bgGradient text-white rounded-full  px-3 py-2'>
                                            {wallet}
                                        </span>
                                    </th>
                                    <td className='px-6 py-4 text-purplemain'>Wallet</td>
                                    <td className=' rounded-r-xl px-6 py-4 text-right'>
                                        <button
                                            id={wallet}
                                            onClick={() => removeUserById(wallet)}
                                            className='font-medium text-red-600 dark:text-blue-500 hover:underline'>
                                            Remove
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
    )
}
