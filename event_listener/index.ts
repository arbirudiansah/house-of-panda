import dotenv from 'dotenv';
import Web3 from "web3";
import HouseOfPandaAbi from "../src/lib/contracts/HouseOfPanda.json"
import { AbiItem } from "ethereum-abi-types-generator";
import { ContractContext } from '../src/lib/types/HouseOfPandaWrapper';
import { EventData } from "web3-eth-contract";

dotenv.config({ path: ".env" })

const startListener = () => {
    const web3 = new Web3("wss://goerli.infura.io/ws/v3/eaf9acc880f140298d5e26f22a53fa64");

    const contractAddress = process.env.NEXT_PUBLIC_SMARTCONTRACT_ADDRESS!;
    const contract = new web3.eth.Contract(HouseOfPandaAbi.abi as AbiItem[], contractAddress) as unknown as ContractContext;

    while (true) {
        contract.events.TransferSingle({}, (error, event: EventData) => {
            if (error) {
                console.error("Error in TransferSingle event handler:", error);
                return;
            }

            const { transactionHash, raw: { topics, data } } = event;

            if (event.raw.topics.length == 4) {
                let trx = web3.eth.abi.decodeLog(
                    [
                        {
                            type: 'address',
                            name: 'from',
                            indexed: true
                        },
                        {
                            type: 'address',
                            name: 'to',
                            indexed: true
                        },
                        {
                            type: 'uint256',
                            name: 'tokenId',
                            indexed: true
                        }
                    ],
                    data,
                    [topics[1], topics[2], topics[3]]
                )

                console.log(`TransferSingle event received:
                Transaction Hash: ${transactionHash}
                Operator: ${trx.operator}
                From: ${trx.from}
                To: ${trx.to}
                Token ID: ${trx.id}
                Value: ${trx.value}
                Data: ${data}`);
            } else {
                console.log(event)
            }

        });
    }
}

console.log('Listening HoP Transfer Events...')
startListener()