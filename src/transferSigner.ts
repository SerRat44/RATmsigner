import { AddressTxsUtxo } from '@mempool/mempool.js/lib/interfaces/bitcoin/addresses';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import {
  BTC_NETWORK,
  BUYING_PSBT_BUYER_RECEIVE_INDEX,
  BUYING_PSBT_PLATFORM_FEE_INDEX,
  BUYING_PSBT_SELLER_SIGNATURE_INDEX,
  DUMMY_UTXO_MAX_VALUE,
  DUMMY_UTXO_MIN_VALUE,
  DUMMY_UTXO_VALUE,
  ORDINALS_POSTAGE_VALUE,
  PLATFORM_FEE_ADDRESS,
} from './constant';
import {
  generateTxidFromHash,
  isP2SHAddress,
  mapUtxos,
  satToBtc,
  toXOnly,
} from './util';
import {
  calculateTxBytesFee,
  calculateTxBytesFeeWithRate,
  getSellerOrdOutputValue,
} from './vendors/feeprovider';
import { FullnodeRPC } from './vendors/fullnoderpc';
import { getFees } from './vendors/mempool';
import {
  FeeProvider,
  IListingState,
  InvalidArgumentError,
  IOrdAPIPostPSBTBuying,
  IOrdAPIPostPSBTListing,
  ItemProvider,
  WitnessUtxo,
  utxo,
} from './interfaces';

bitcoin.initEccLib(ecc);

const network =
  BTC_NETWORK === 'mainnet'
    ? bitcoin.networks.bitcoin
    : bitcoin.networks.testnet;

export namespace SellerSigner {}
