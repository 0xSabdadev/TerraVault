import {getSession, signOut} from 'next-auth/react'
import Header from '../components/Header'
import WalletTable from '../components/WalletTable'
import Footer from '../components/Footer'
import Web3 from 'web3'
import data from '../build/contracts/MultiSigFactory.json' assert {type: 'json'}
import {useEffect, useState} from 'react'
import {toast} from 'sonner'
import Jumbotron from '../components/Jumbotron'
// import 'flowbite'
import Head from 'next/head'

function User({user}) {
    const [listFactoryInstance, setListtFactoryInstance] = useState('')

    // const [contractFactoryInstance, setContractFactoryInstance] = useState('')
    // const [account, setAccount] = useState('')
    // setAccount(user.address)
    useEffect(() => {
        loadFactory()
        // console.log(listFactoryInstance)
    }, [])

    const loadFactory = async () => {
        try {
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data.networks[networkId]
            let contractFactoryInstance = ''
            if (networkData) {
                contractFactoryInstance = new web3.eth.Contract(data.abi, networkData.address, {
                    from: user.address,
                })
                const userWallets = await contractFactoryInstance.methods.getUserWallets().call()

                setListtFactoryInstance(userWallets)
                // console.log('User Wallets:', typeof listFactoryInstance)
            } else {
                toast.error('Contract not deployed to detected network.')
            }
        } catch (error) {
            toast.error('Error loading user wallets:', error)
        }
    }

    const createNewWallet = async () => {
        try {
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data.networks[networkId]
            let contractFactoryInstance = ''
            if (networkData) {
                contractFactoryInstance = new web3.eth.Contract(data.abi, networkData.address, {
                    from: user.address,
                })
                await contractFactoryInstance.methods
                    .createNewWallet()
                    .send({from: user.address})
                    .then(() => {
                        loadFactory()
                        toast.success('Successfully created wallet instance')
                    })
            } else {
                toast.error('Contract not deployed to detected network.')
            }
        } catch (error) {
            toast.error('Error creating wallet:', error)
        }
    }

    return (
        <div>
            <Head>
                <title>VaultHarmony - Dashboard</title>
            </Head>
            <Header user={user} />
            <Jumbotron createNewWallet={createNewWallet} />
            <WalletTable dataOwner={listFactoryInstance} />
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }

    return {
        // redirect: {
        //     destination: '/',
        //     permanent: false,
        // },
        props: {user: session.user},
    }
}

export default User
