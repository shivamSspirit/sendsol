import { FC, useState } from 'react'
import * as Web3 from '@solana/web3.js'
import styles from '../styles/Home.module.css'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const PROGRAM_ID = new Web3.PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa")
const PROGRAM_DATA_PUBLIC_KEY = new Web3.PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod")

export const SendSolForm: FC = () => {
    const [solprice, setSolprice] = useState('');
    const [toAddress, setAddress] = useState();
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onChangeForm = (e: any) => {
        if (e.target.name === 'solprice') {
            setSolprice(e.target.value)
        }
        if (e.target.name === 'pubid') {
            setAddress(e.target.value)
        }
    }

    async function sendSols(connection: Web3.Connection, amount: number, to: Web3.PublicKey, sender: Web3.Keypair) {

        if (!connection || !publicKey) { return }
        const transaction = new Web3.Transaction()
        const sendSolInstruction = Web3.SystemProgram.transfer(
            {
                fromPubkey: publicKey,
                toPubkey: to,
                lamports: amount,
            }
        )
        transaction.add(sendSolInstruction)
        sendTransaction(transaction, connection).then(sig => {
            console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`);
        })
        // const sig = await Web3.sendAndConfirmTransaction(connection, transaction, [sender])
       
    }


    const sendSol = async (event:any) => {
        event.preventDefault()
        const amount = Number(solprice)*Web3.LAMPORTS_PER_SOL;
        const newKeypair =  Web3.Keypair.generate()
        const toAddressss= new Web3.PublicKey(toAddress);
        await sendSols(connection, amount, toAddressss, newKeypair)
    }



    return (
        <div>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input onChange={onChangeForm} name='solprice' value={solprice} id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input onChange={onChangeForm} name='pubid' value={toAddress} id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Send</button>
            </form>
        </div>
    )
}