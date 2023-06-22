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

# Rat's docs for stupid mfs

## Interfaces

**InvalidArgumentError (Class)** <br>
This class extends the built-in Error class in JavaScript. It's used to throw an error when an invalid argument is passed to a function.

**WitnessUtxo (Interface)** <br>
This interface represents a Witness UTXO (Unspent Transaction Output).

- script (Buffer): Represents the script of the UTXO.
- value (number): Represents the value of the UTXO.

**FeeProvider (Interface)** <br>
This interface represents a fee provider.

- getMakerFeeBp(maker: string) (Method): Returns a Promise that resolves to a number representing the maker fee in basis points.
- getTakerFeeBp(taker: string) (Method): Returns a Promise that resolves to a number representing the taker fee in basis points.

**ItemProvider (Interface)** <br>
This interface represents an item provider.

- getTokenByOutput(output: string) (Method): Returns a Promise that resolves to an IOrdItem or null.
- getTokenById(tokenId: string) (Method): Returns a Promise that resolves to an IOrdItem or null.

**IOrdItem (Interface)** <br>
This interface represents an Ord item.

Fixed
- id (string): The unique identifier of the item.
- contentURI (string): The URI where the content of the item can be found.
- contentType (string): The type of the content (e.g., image, video, etc.).
- contentPreviewURI (string): The URI where a preview of the content can be found.
- sat (number): The price of the item in satoshis.
- satName (string): The name of the satoshi unit used.
- genesisTransaction (string): The transaction where the item was first created.
- genesisTransactionBlocktime (string, optional): The block time of the genesis transaction.
- genesisTransactionBlockHash (string, optional): The block hash of the genesis transaction.
- inscriptionNumber (number): The number of the inscription on the item.
- meta (IOrdItemMeta, optional): The metadata of the item.
- chain (string): The blockchain where the item exists.
- owner (string): The owner of the item.

Dynamic
- location (string): The location of the item on the blockchain.
- locationBlockHeight (number, optional): The block height of the item's location.
- locationBlocktime (string, optional): The block time of the item's location.
- locationBlockHash (string, optional): The block hash of the item's location.
- outputValue (number): The output value of the item.
- output (string): The output of the item.
- mempoolTxId (string, optional): The transaction ID of the item in the mempool.

Listing
- listed (boolean): Whether the item is listed for sale or not.
- listedAt (string, optional): The time when the item was listed.
- listedPrice (number, optional): The price of the item when it was listed.
- listedMakerFeeBp (number, optional): The maker fee in basis points when the item was listed.
- listedSellerReceiveAddress (string, optional): The address where the seller will receive the payment.

**IOrdItemMeta (Interface)** <br>
This interface represents the metadata of an Ord item.

- name (string): The name of the item.
- high_res_img_url (string, optional): The high resolution image URL of the item.
- status (string, optional): The status of the item.
- rank (number, optional): The rank of the item.
- attributes (IOrdItemAttribute[], optional): The attributes of the item.

**IOrdItemAttribute (Interface)** <br>
This interface represents an attribute of an Ord item.

- trait_type (string): The type of the trait.
- value (string): The value of the trait.
- status (string, optional): The status of the trait.
- percent (string, optional): The percentage of the trait.

**IOrdAPIPostPSBTBuying (Interface)** <br>
This interface represents a request to post a PSBT buying.

- price (number): The price of the item.
- tokenId (string): The token ID of the item.
- buyerAddress (string): The address of the buyer.
- buyerTokenReceiveAddress (string): The address where the buyer will receive the token.
- signedBuyingPSBTBase64 (string): The signed buying PSBT in base64 format.

**IOrdAPIPostPSBTListing (Interface)** <br>
This interface represents a request to post a PSBT listing.

- price (number): The price of the item.
- tokenId (string): The token ID of the item.
- sellerReceiveAddress (string): The address where the seller will receive the payment.
- signedListingPSBTBase64 (string): The signed listing PSBT in base64 format.
- tapInternalKey (string, optional): The tap internal key.

**IListingState (Interface)** <br>
This interface represents the state of a listing.

- seller (Object): Contains information about the seller.
    - makerFeeBp (number): The maker fee in basis points.
    - sellerOrdAddress (string): The address of the seller.
    - price (number): The price of the item.
    - ordItem (IOrdItem): The item being sold.
    - sellerReceiveAddress (string): The address where the seller will receive the payment.
    - unsignedListingPSBTBase64 (string, optional): The unsigned listing PSBT in base64 format.
    - signedListingPSBTBase64 (string, optional): The signed listing PSBT in base64 format.
    - tapInternalKey (string, optional): The tap internal key.

- buyer (Object, optional): Contains information about the buyer.
    - takerFeeBp (number): The taker fee in basis points.
    - buyerAddress (string): The address of the buyer.
    - buyerTokenReceiveAddress (string): The address where the buyer will receive the token.
    - feeRateTier (string): The fee rate tier.
    - buyerPublicKey (string, optional): The public key of the buyer.
    - unsignedBuyingPSBTBase64 (string, optional): The unsigned buying PSBT in base64 format.
    - unsignedBuyingPSBTInputSize (number, optional): The input size of the unsigned buying PSBT.
    - signedBuyingPSBTBase64 (string, optional): The signed buying PSBT in base64 format.
    - buyerDummyUTXOs (utxo[], optional): The dummy UTXOs of the buyer.
    - buyerPaymentUTXOs (utxo[], optional): The payment UTXOs of the buyer.
    - mergedSignedBuyingPSBTBase64 (string, optional): The merged and signed buying PSBT in base64 format.

**utxo (Interface)** <br>
This interface represents a UTXO (Unspent Transaction Output).

- txid (string): The transaction ID of the UTXO.
- vout (number): The output index of the UTXO.
- value (number): The value of the UTXO.
- status (TxStatus): The status of the UTXO.
- tx (bitcoin.Transaction): The transaction of the UTXO.

## Methods

### SellerSigner

**generateUnsignedListingPSBTBase64**

`async function generateUnsignedListingPSBTBase64(
    listing: IListingState,
): Promise<IListingState>`

This asynchronous function generates an unsigned PSBT (Partially Signed Bitcoin Transaction) in base64 format for a given listing. It takes in the following parameter:

- listing: An instance of the IListingState interface. This represents the state of a listing.

The function returns a Promise that resolves to an instance of the IListingState interface. The returned instance includes the unsigned PSBT in base64 format.

**verifySignedListingPSBTBase64**

`async function verifySignedListingPSBTBase64(
    req: IOrdAPIPostPSBTListing,
    feeProvider: FeeProvider,
    itemProvider: ItemProvider,
): Promise<void>`

This asynchronous function verifies a signed PSBT in base64 format. It takes in the following parameters:

- req: An instance of the IOrdAPIPostPSBTListing interface. This represents a request to post a PSBT listing.
- feeProvider: An instance of the FeeProvider interface. This is used to get the maker and taker fees.
- itemProvider: An instance of the ItemProvider interface. This is used to get the item by output or by ID.

The function returns a Promise that resolves to void. If the verification fails, the function throws an InvalidArgumentError.

### BuyerSigner

**selectDummyUTXOs**

`async function selectDummyUTXOs(
    utxos: AddressTxsUtxo[],
    itemProvider: ItemProvider,
): Promise<utxo[] | null>`

This asynchronous function selects dummy UTXOs (Unspent Transaction Outputs) from a given list of UTXOs. It takes in the following parameters:

- utxos: An array of AddressTxsUtxo objects. These represent the UTXOs to select from.
- itemProvider: An instance of the ItemProvider interface. This is used to get the item by output or by ID.
- The function returns a Promise that resolves to an array of utxo objects or null. The returned array includes the selected dummy UTXOs.

**selectPaymentUTXOs**

`async function selectPaymentUTXOs(
    utxos: AddressTxsUtxo[],
    amount: number, // amount is expected total output (except tx fee)
    vinsLength: number,
    voutsLength: number,
    feeRateTier: string,
    itemProvider: ItemProvider,
)`

This asynchronous function selects payment UTXOs from a given list of UTXOs. It takes in the following parameters:

- utxos: An array of AddressTxsUtxo objects. These represent the UTXOs to select from.
- amount: A number representing the expected total output (excluding transaction fee).
- vinsLength: A number representing the length of the vins.
- voutsLength: A number representing the length of the vouts.
- feeRateTier: A string representing the fee rate tier.
- itemProvider: An instance of the ItemProvider interface. This is used to get the item by output or by ID.

The function returns a Promise that resolves to an array of utxo objects. The returned array includes the selected payment UTXOs. If the selected amount is less than the required amount, the function throws an InvalidArgumentError.

**generateUnsignedBuyingPSBTBase64**

`async function generateUnsignedBuyingPSBTBase64(
    listing: IListingState,
): Promise<IListingState>`

This asynchronous function generates an unsigned PSBT (Partially Signed Bitcoin Transaction) in base64 format for a given listing. It takes in the following parameter:

- listing: An instance of the IListingState interface. This represents the state of a listing.
- The function returns a Promise that resolves to an instance of the IListingState interface. The returned instance includes the unsigned PSBT in base64 format.

**mergeSignedBuyingPSBTBase64**

`function mergeSignedBuyingPSBTBase64(
    signedListingPSBTBase64: string,
    signedBuyingPSBTBase64: string,
): string`

This function merges a signed listing PSBT and a signed buying PSBT, both in base64 format. It takes in the following parameters:

- signedListingPSBTBase64: A string representing the signed listing PSBT in base64 format.
- signedBuyingPSBTBase64: A string representing the signed buying PSBT in base64 format.

The function returns a string representing the merged PSBT in base64 format.

**verifySignedBuyingPSBTBase64**

`async function verifySignedBuyingPSBTBase64(
    req: IOrdAPIPostPSBTBuying,
    feeProvider: FeeProvider,
    itemProvider: ItemProvider,
): Promise<{
    newOutputOffset: number;
}>`

This asynchronous function verifies a signed buying PSBT in base64 format. It takes in the following parameters:

- req: An instance of the IOrdAPIPostPSBTBuying interface. This represents the request to post a PSBT for buying.
- feeProvider: An instance of the FeeProvider interface. This provides the fee details.
- itemProvider: An instance of the ItemProvider interface. This provides the item details.

The function returns a Promise that resolves to an object containing a newOutputOffset property, which is a number.

**generateUnsignedCreateDummyUtxoPSBTBase64**

`async function generateUnsignedCreateDummyUtxoPSBTBase64(
    address: string,
    buyerPublicKey: string | undefined,
    unqualifiedUtxos: AddressTxsUtxo[],
    feeRateTier: string,
    itemProvider: ItemProvider,
): Promise<string>`

This asynchronous function generates an unsigned PSBT in base64 format for creating a dummy UTXO. It takes in the following parameters:

- address: A string representing the address.
- buyerPublicKey: A string representing the buyer's public key. This can be undefined.
- unqualifiedUtxos: An array of AddressTxsUtxo instances. These represent the unqualified UTXOs.
- feeRateTier: A string representing the fee rate tier.
- itemProvider: An instance of the ItemProvider interface. This provides the item details.

The function returns a Promise that resolves to a string representing the unsigned PSBT in base64 format for creating a dummy UTXO.
