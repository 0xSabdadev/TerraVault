import Header from '../components/Header'
import Footer from '../components/Footer'
import JumbotronWallet from '../components/JumbotronWallet'
import Head from 'next/head'
import {getSession, signOut} from 'next-auth/react'
import Content from '../components/TabLayout/Content'
import TabContent from '../components/TabLayout/TabContent'
import TabLayout from '../components/TabLayout/TabLayout'
import TabMenu from '../components/TabLayout/TabMenu'
import FormAdmin from '../components/TabLayout/admin/FormAdmin'
import ListWallet from '../components/TabLayout/admin/ListWallet'
import FormAccount from '../components/TabLayout/account/FormAccount'
import HistoryDepo from '../components/TabLayout/account/HistoryDepo'
import HistoryWithdraw from '../components/TabLayout/account/HistoryWithdraw'
import HistoryPending from '../components/TabLayout/transfer/HistoryPending'
import FormTf from '../components/TabLayout/transfer/FormTf'
import HistoryCancel from '../components/TabLayout/transfer/HistoryCancel'
import HistoryTf from '../components/TabLayout/transfer/HistoryTf'
import Web3 from 'web3'
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import data from '../build/contracts/MultiSigFactory.json' assert {type: 'json'}
import data1 from '../build/contracts/MultiSigTA.json' assert {type: 'json'}
import {toast} from 'sonner'
import axios from 'axios'
import ModalDepo from '../components/TabLayout/account/ModalDepo'

function Wallet({user}) {
    var currentSelectedWallet = ''
    const [walletId, setWalletId] = useState('')
    const [balance, setBalance] = useState(0)
    const [idrBalance, setIdrBalance] = useState(null)
    const [ethToIdrRate, setEthToIdrRate] = useState(null)
    const [listWalletOwners, setListWalletOwners] = useState('')
    const [factoryAddress, setFactoryAddress] = useState('')
    // accounts
    const [listDepo, setListDepo] = useState('')
    const [listWith, setListWith] = useState('')
    const [listAcc, setListAcc] = useState('')
    const [listCancel, setListCancel] = useState('')
    const [listCreated, setListCreated] = useState('')
    const [listPending, setListPending] = useState('')

    const router = useRouter()

    useEffect(() => {
        const retrievedUserWalletObject = localStorage.getItem('userWalletObject')
        currentSelectedWallet = retrievedUserWalletObject
        loadFactory(currentSelectedWallet)
        loadBlockchainData(currentSelectedWallet)
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=idr`
        axios
            .get(apiUrl)
            .then(response => {
                const rate = response.data.ethereum.idr
                setEthToIdrRate(rate)
            })
            .catch(error => console.error('Error fetching exchange rate:', error))
        loadWalletOwners(currentSelectedWallet)
        // loadHistory()
        loadHistory(currentSelectedWallet, 'fundsDeposited')
        loadHistory(currentSelectedWallet, 'fundsWithdrawed')
        loadPendingTransfers(currentSelectedWallet)
        loadAccountsTables(currentSelectedWallet, 'transferCreated')
        loadAccountsTables(currentSelectedWallet, 'transferApproved')
        loadAccountsTables(currentSelectedWallet, 'transferCancelled')
        // console.log(listDepo)
    }, [])

    useEffect(() => {
        if (ethToIdrRate !== null) {
            const convertedAmount = balance * ethToIdrRate
            setIdrBalance(convertedAmount.toFixed(3))
        }
    }, [balance, ethToIdrRate])

    const loadFactory = async currWallet => {
        try {
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data.networks[networkId]
            setFactoryAddress(networkData.address)
            if (!networkData) {
                toast.error('Contract not deployed to detected network.')
                return
            }

            const contractFactoryInstance = new web3.eth.Contract(data.abi, networkData.address, {
                from: user.address,
            })

            const walletIdResult = await contractFactoryInstance.methods
                .getWalletID(currWallet)
                .call()
            setWalletId(walletIdResult)

            const userWalletsResult = await contractFactoryInstance.methods.getUserWallets().call()
            const isWalletFound = userWalletsResult.some(subarray => subarray.includes(currWallet))

            if (!isWalletFound) {
                router.push('/')
            }
        } catch (error) {
            toast.error('Error loading user wallets: ' + error)
        }
    }

    const loadBlockchainData = async currWallet => {
        try {
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data1.networks[networkId]

            if (!networkData) {
                toast.error('Contract Multisig not deployed to detected network.')
                return
            }

            const contractInstance = new web3.eth.Contract(data1.abi, currWallet, {
                from: user.address,
            })

            const value = await contractInstance.methods.getBalance('ETH').call()
            const balanceValue = (value / 10 ** 18).toFixed(3)
            setBalance(balanceValue)
        } catch (error) {
            toast.error('Error loading wallet multisig: ' + error)
        }
    }

    const loadWalletOwners = async currWallet => {
        try {
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data1.networks[networkId]

            if (!networkData) {
                toast.error('Contract Multisig not deployed to detected network.')
                return
            }

            const contractInstance = new web3.eth.Contract(data1.abi, currWallet, {
                from: user.address,
            })

            const owners = await contractInstance.methods
                .getWalletOwners()
                .call({from: user.address})

            setListWalletOwners(owners)
        } catch (error) {
            toast.error('Error loading wallet owners: ' + error)
        }
    }

    // account
    const loadHistory = async (currWallet, emit) => {
        try {
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data1.networks[networkId]

            if (!networkData) {
                toast.error('Contract Multisig not deployed to detected network.')
                return
            }

            const contractInstance = new web3.eth.Contract(data1.abi, currWallet, {
                from: user.address,
            })

            const history_acc = await contractInstance.getPastEvents(emit, {fromBlock: 0})

            if (emit == 'fundsDeposited') {
                setListDepo(history_acc)
            } else if (emit == 'fundsWithdrawed') {
                setListWith(history_acc)
            } else {
                return
            }
        } catch (error) {
            toast.error('Error loading wallet owners: ' + error)
        }
    }

    const loadAccountsTables = async (currWallet, emit) => {
        try {
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data1.networks[networkId]

            if (!networkData) {
                toast.error('Contract Multisig not deployed to detected network.')
                return
            }

            const contractInstance = new web3.eth.Contract(data1.abi, currWallet, {
                from: user.address,
            })

            const historyTf = await contractInstance.getPastEvents(emit, {fromBlock: 0})

            if (emit == 'transferApproved') {
                setListAcc(historyTf)
            } else if (emit == 'transferCancelled') {
                setListCancel(historyTf)
            } else if (emit == 'transferCreated') {
                setListCreated(historyTf)
            } else {
                return
            }
        } catch (error) {
            toast.error('Error loading history tf: ' + error)
        }
    }

    const loadPendingTransfers = async (currWallet, emit) => {
        try {
            const web3 = new Web3(window.web3.currentProvider)
            const networkId = await web3.eth.net.getId()
            const networkData = data1.networks[networkId]

            if (!networkData) {
                toast.error('Contract Multisig not deployed to detected network.')
                return
            }

            const contractInstance = new web3.eth.Contract(data1.abi, currWallet, {
                from: user.address,
            })

            const history_pending = await contractInstance.methods.getTransferRequests().call()

            setListPending(history_pending)
        } catch (error) {
            toast.error('Error loading history pending: ' + error)
        }
    }

    return (
        <div>
            <Head>
                <title>VaultHarmony - Dashboard</title>
            </Head>
            <Header user={user} id={walletId} balance={balance} idr={idrBalance} />
            <JumbotronWallet />
            <TabLayout>
                <TabMenu />
                <TabContent>
                    <Content id={'admin'} ariaLabelledby={'admin-tab'} title={'Admin'}>
                        {/* admin */}
                        <FormAdmin
                            user={user}
                            addr={factoryAddress}
                            loadWalletOwners={loadWalletOwners}
                        />
                        <ListWallet
                            list={listWalletOwners}
                            user={user}
                            addr={factoryAddress}
                            loadWalletOwners={loadWalletOwners}
                        />
                    </Content>
                    <Content id={'accounts'} ariaLabelledby={'accounts-tab'} title={'Accounts'}>
                        {/* ccount */}
                        <FormAccount
                            user={user}
                            loadHistory={loadHistory}
                            loadBlockchainData={loadBlockchainData}
                        />
                        <HistoryDepo listDepo={listDepo} />
                        <HistoryWithdraw listWith={listWith} />
                    </Content>
                    <Content id={'transfers'} ariaLabelledby={'transfers-tab'} title={'Transfers'}>
                        {/* tx */}
                        <FormTf
                            user={user}
                            loadAccountsTables={loadAccountsTables}
                            loadPendingTransfers={loadPendingTransfers}
                            loadBlockchainData={loadBlockchainData}
                        />
                        <HistoryPending
                            listPending={listPending}
                            listCreated={listCreated}
                            user={user}
                            loadAccountsTables={loadAccountsTables}
                            loadPendingTransfers={loadPendingTransfers}
                            loadBlockchainData={loadBlockchainData}
                        />
                        <HistoryTf listAcc={listAcc} />
                        <HistoryCancel listCancel={listCancel} />
                    </Content>
                    <Content></Content>
                </TabContent>
            </TabLayout>
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
        props: {user: session.user},
    }
}

export default Wallet
