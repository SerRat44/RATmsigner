# msigner: Ordinals Atomic Swap PSBT Signer

msigner is an open source Bitcoin Ordinals Partially Signed Bitcoin Transactions (PSBT) signer library. It supports atomic swap of the inscription and provides a simple and secure way to structure Bitcoin transactions for marketplaces.

## Features

msigner library comes packed with a variety of features that make it an ideal choice for anyone looking for a simple and secure way to sign Bitcoin transactions. Here are some of the key features that set msigner apart:

- **2-Dummy UTXO algorithm (Latest Design)**: The library leverages a 2-Dummy UTXO algorithm that provides maximal protection to the offset of the ordinals. As a convention of the ecosystem, it provides an utxo of the NFT at location offset `0` with postage 10k sats. This algorithm ensures that the transactions are secure and that the NFT will not be accidentally included as other programs’ dummy UTXOs, or burn into miner fees.
- **Seller-Buyer-friendly API**:
    - Protecting Buyer: The buyer signer API ensures that buyers are protected by allowing them to sign the whole PSBT without needing to know the seller signatures. This means that the buyer can create a `sighash_all` transaction without revealing any information about the seller's signature, at the same time, the buyer can verify that the trackable sat is sending towards the correct location. As a result, the buyer can be confident that their interests are protected throughout the transaction process.
    - Protecting Seller: The seller signer API makes sure that the seller signature is not broadcasted, it is possible to change the price and cancel listings in a trust-minimized world. Since the marketplace platform can combine the seller’s `sighash_single|anyonecanpay` with the buyer’s `sighash_all` signatures, parties involved do not need to trust each other, rather they can rely on leveraging the wallets to **verify** the PSBT correctly.
- **Trust-minimized PSBT combining**: The library makes combining PSBT trust-minimized and requires 0 communication from the seller and buyer. This feature ensures that the transaction is secure and that the parties involved can trust each other without the need of further communication. The combined PSBT can be processed with mempool acceptance tests.
- **Wide range of wallets support**: msigner is targeting the browser-extension-type of wallets. `Hiro`, `Xverse`, `Unisats` are fully supported with P2SH, P2WPKH, P2TR inputs.
- Support maker/taker fees.
- Support dynamic bitcoin network fee with the selection of `fastestFee`, `halfHourFee`, `hourFee`, `minimumFee`.
- Support different address to receive NFTs and Fund for both the seller and the buyer signer.
- Support buyer and seller verification via fullnode’s mempool and the itemProvider.

## How it works

<img src="./docs/psbt.excalidraw.png" width="600">

As a seller:
- Sign a single PSBT using the `SIGHASH_SINGLE | ANYONECANPAY`

As a buyer:
- Sign a full PSBT using the `SIGHASH_DEFAULT` with all the information available to the buyer, except the seller signature (i.e. finalScriptWitness).

As a platform combiner
- Verify seller signature
- Verify buyer signature
- Merge seller and buyer signatures
- Finalize and run mempool acceptance test
- Broadcast the tx

## Development

msigner is supposed to be used a dependency in any nodejs environment.
To develop msigner, simply clone the repository and follow these steps:

1. Install the required dependencies by running `npm install`.
2. Build the library by running `npm run build`.
3. Run the tests to ensure everything is working correctly by running `npm test`. More unit tests are coming!

## License
Apache 2.0




From signer.ts
SellerSigner
generateUnsignedListingPSBTBase64(listing: IListingState): Promise<IListingState>
This function is used to generate an unsigned PSBT (Partially Signed Bitcoin Transaction) for a listing. It takes in a listing object of type IListingState and returns a Promise that resolves to an updated listing object with the unsigned PSBT.

verifySignedListingPSBTBase64(req: IOrdAPIPostPSBTListing, feeProvider: FeeProvider, itemProvider: ItemProvider): Promise<void>
This function is used to verify a signed PSBT for a listing. It takes in a req object of type IOrdAPIPostPSBTListing, a feeProvider of type FeeProvider, and an itemProvider of type ItemProvider. It returns a Promise that resolves to void. If the PSBT is invalid, it will throw an error.

BuyerSigner
selectDummyUTXOs(utxos: AddressTxsUtxo[], itemProvider: ItemProvider): Promise<utxo[] | null>
This function is used to select dummy UTXOs (Unspent Transaction Outputs) from a list of UTXOs. It takes in an array of utxos of type AddressTxsUtxo[] and an itemProvider of type ItemProvider. It returns a Promise that resolves to an array of selected UTXOs of type utxo[] or null if no UTXOs could be selected.

selectPaymentUTXOs(utxos: AddressTxsUtxo[], amount: number, vinsLength: number, voutsLength: number, feeRateTier: string, itemProvider: ItemProvider)
This function is used to select payment UTXOs from a list of UTXOs. It takes in an array of utxos of type AddressTxsUtxo[], an amount of type number representing the total expected output, vinsLength and voutsLength of type number representing the number of input and output transactions respectively, a feeRateTier of type string representing the fee rate tier, and an itemProvider of type ItemProvider. It returns a Promise that resolves to an array of selected UTXOs of type utxo[].

doesUtxoContainInscription(utxo: AddressTxsUtxo, itemProvider: ItemProvider): Promise<boolean>
This function is used to check if a UTXO contains an inscription. It takes in a utxo of type AddressTxsUtxo and an itemProvider of type ItemProvider. It returns a Promise that resolves to a boolean indicating whether the UTXO contains an inscription.

getSellerInputAndOutput(listing: IListingState)
This function is used to get the seller's input and output for a listing. It takes in a listing object of type IListingState and returns a Promise that resolves to an object containing the seller's input and output.

From interfaces.ts
This file exports a number of interfaces that are used to type the objects and parameters in the signer.ts functions. These interfaces provide a blueprint for the shape of the objects, specifying the types of their properties.

The exported interfaces

Used Chat with Code
The interfaces.ts file exports several interfaces that are used to type the objects and parameters in the signer.ts functions. Here are the exported interfaces:

InvalidArgumentError
This is a class that extends the built-in Error class in JavaScript. It's used to throw an error when an invalid argument is passed to a function.

WitnessUtxo
This interface represents a Witness UTXO (Unspent Transaction Output). It has two properties:

script: A Buffer representing the script of the UTXO.
value: A number representing the value of the UTXO.
FeeProvider
This interface represents a fee provider. It has two methods:

getMakerFeeBp(maker: string): Returns a Promise that resolves to a number representing the maker fee in basis points.
getTakerFeeBp(taker: string): Returns a Promise that resolves to a number representing the taker fee in basis points.
ItemProvider
This interface represents an item provider. It has two methods:

getTokenByOutput(output: string): Returns a Promise that resolves to an IOrdItem or null.
getTokenById(tokenId: string): Returns a Promise that resolves to an IOrdItem or null.
IOrdItem
This interface represents an Ord item. It has several properties, including id, contentURI, contentType, contentPreviewURI, sat, satName, genesisTransaction, genesisTransactionBlocktime, genesisTransactionBlockHash, inscriptionNumber, meta, chain, owner, location, locationBlockHeight, locationBlocktime, locationBlockHash, outputValue, output, mempoolTxId, listed, listedAt, listedPrice, listedMakerFeeBp, and listedSellerReceiveAddress.

IOrdItemMeta
This interface represents the metadata of an Ord item. It has several properties, including name, high_res_img_url, status, rank, and attributes.

IOrdItemAttribute
This interface represents an attribute of an Ord item. It has several properties, including trait_type, value, status, and percent.

IOrdAPIPostPSBTBuying
This interface represents a request to post a PSBT buying. It has several properties, including price, tokenId, buyerAddress, buyerTokenReceiveAddress, and signedBuyingPSBTBase64.

IListingState
This interface represents the state of a listing. It has two properties:

seller: An object with several properties, including makerFeeBp, sellerOrdAddress, price, ordItem, sellerReceiveAddress, unsignedListingPSBTBase64, signedListingPSBTBase64, and tapInternalKey.
buyer: An object with several properties, including takerFeeBp, buyerAddress, buyerTokenReceiveAddress, feeRateTier, buyerPublicKey, unsignedBuyingPSBTBase64, unsignedBuyingPSBTInputSize, signedBuyingPSBTBase64, buyerDummyUTXOs, buyerPaymentUTXOs, and mergedSignedBuyingPSBTBase64.
utxo
This interface represents a UTXO. It has several properties, including txid, vout, value, status, and tx.





