import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { construct, getRegistry, createMetadata, methods, TypeRegistry } from 'txwrapper-deeper';
import { IKeyringPair } from '@polkadot/types/types';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';

export class SideCar {
    readonly client: AxiosInstance;
    cachedNonce: number;

    constructor(sideCarURL: string, timeoutMs: number, deviceId: string) {
        const headers: AxiosRequestHeaders = { 'Content-Type': 'application/json' }
        if (deviceId) {
            headers['X-Device-Id'] = deviceId;
        }
        this.client = axios.create({
            baseURL: sideCarURL,
            timeout: timeoutMs,
            headers,
            responseType: 'json',
        });
        this.cachedNonce = 0;
    }

    async getUserCreditData(address: string): Promise<IUserCredit> {
        const res = await this.client.get<IStorageResponse<IUserCreditRaw>>(`/pallets/credit/storage/UserCredit`, {
            params: {
                key1: address,
            },
        });
        return convertUserCreditRaw(res.data.value);
    }

    async getTotalChannelBalance(address: string): Promise<BigInt> {
        const res = await this.client.get<IStorageResponse<string>>('/pallets/micropayment/storage/TotalMicropaymentChannelBalance', {
            params: {
                key1: address,
            },
        });
        return res.data.value ? BigInt(res.data.value) : BigInt(0);
    }

    async getAccountBalanceInfo(address: string): Promise<IAccountBalance> {
        const res = await this.client.get<IAccountBalanceResponse>(`/accounts/${address}/balance-info`);
        return convertAccountBalance(res.data);
    }

    // 获取构建离线交易需要的参数
    async getTransactionMaterial(): Promise<ITransactionMaterial> {
        const res = await this.client.get<ITransactionMaterialResponse>('/transaction/material', {
            params: {
                metadata: 'scale',
            },
        });
        return convertTransactionMaterial(res.data);
    }

    async getLatestBlock(): Promise<IBlockHeader> {
        const res = await this.client.get<IBlockHeaderResponse>('/blocks/head');
        return convertBlockHeader(res.data);
    }

    async sendTx(signedTx: string): Promise<string> {
        const res = await this.client.post('/transaction', {
            tx: signedTx,
        }); // TODO: 处理交易异常情况
        return res.data.hash;
    }

    async imOnline(deviceKeyPair: IKeyringPair): Promise<string> {
        const method = methods.deeperNode.imOnline;
        const { baseTxInfo, txOptions, metadataRpc, registry } = await this.getTransactionArgs(deviceKeyPair.address);
        const unsigned = method({}, baseTxInfo, txOptions);
        const signingPayload = construct.signingPayload(unsigned, { registry }); // 签名原文
        const signature = await this.signWith(deviceKeyPair, signingPayload, registry, metadataRpc); // 签名值
        const tx = construct.signedTx(unsigned, signature, { metadataRpc, registry }); // 带有签名的交易
        return await this.sendTx(tx);
    }

    async registerServer(deviceKeyPair: IKeyringPair, duration: number): Promise<string> {
        const method = methods.deeperNode.registerServer;
        const { baseTxInfo, txOptions, metadataRpc, registry } = await this.getTransactionArgs(deviceKeyPair.address);
        const unsigned = method({ durationEras: duration }, baseTxInfo, txOptions);
        const signingPayload = construct.signingPayload(unsigned, { registry }); // 签名原文
        const signature = await this.signWith(deviceKeyPair, signingPayload, registry, metadataRpc); // 签名值
        const tx = construct.signedTx(unsigned, signature, { metadataRpc, registry }); // 带有签名的交易
        return await this.sendTx(tx);
    }

    // json无法处理大整数，因此转账时使用string来表示金额
    async transfer(deviceKeyPair: IKeyringPair, dest: string, value: string) {
        const method = methods.balances.transfer;
        const { baseTxInfo, txOptions, metadataRpc, registry } = await this.getTransactionArgs(deviceKeyPair.address);
        const unsigned = method({ dest, value }, baseTxInfo, txOptions);
        const signingPayload = construct.signingPayload(unsigned, { registry }); // 签名原文
        const signature = await this.signWith(deviceKeyPair, signingPayload, registry, metadataRpc); // 签名值
        const tx = construct.signedTx(unsigned, signature, { metadataRpc, registry }); // 带有签名的交易
        return await this.sendTx(tx);
    }

    async getTransactionArgs(address: string) {
        const {
            specVersion,
            txVersion: transactionVersion,
            specName,
            metadata: metadataRpc,
            chainName,
            genesisHash,
        } = await this.getTransactionMaterial();
        const registry = getRegistry({
            chainName,
            specName,
            specVersion,
            metadataRpc,
        });

        const block = await this.getLatestBlock();
        const { nonce: index } = await this.getAccountBalanceInfo(address);

        if (this.cachedNonce === 0) {
            this.cachedNonce = index;
        } else if (index <= this.cachedNonce) {
            this.cachedNonce++;
        }
        const baseTxInfo = {
            address: address,
            blockHash: block.hash,
            blockNumber: block.number,
            eraPeriod: 64, // not sure, use default value!
            genesisHash,
            metadataRpc,
            nonce: this.cachedNonce,
            specVersion,
            tip: 0,
            transactionVersion,
        };
        const txOptions = { metadataRpc, registry };

        return {
            baseTxInfo,
            txOptions,
            metadataRpc,
            registry,
        };
    }

    async signWith(pair: IKeyringPair, signingPayload: string, registry: TypeRegistry, metadataRpc: `0x${string}`): Promise<`0x${string}`> {
        registry.setMetadata(createMetadata(registry, metadataRpc));

        const { signature } = registry
            .createType('ExtrinsicPayload', signingPayload, {
                version: EXTRINSIC_VERSION,
            })
            .sign(pair);

        return signature;
    }
}

export const testSideCar = new SideCar('http://127.0.0.1:8080', 10000, '');

// {
//     "at": {
//       "hash": "0x2f1801d4d1471d1c8efd4893139c68b374268a586febc404427bbb5a86b3f2ae",
//       "height": "12"
//     },
//     "pallet": "credit",
//     "palletIndex": "8",
//     "storageItem": "userCredit",
//     "key1": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
//     "value": {
//       "campaignId": "0",
//       "credit": "100",
//       "initialCreditLevel": "One",
//       "rankInInitialCreditLevel": "1",
//       "numberOfReferees": "1",
//       "currentCreditLevel": "One",
//       "rewardEras": "100"
//     }
//   }
interface IStorageResponse<T> {
    at: IAtRaw;
    pallet: string;
    palletIndex: string;
    storageItem: string;
    key1: string;
    value: T
}

interface IUserCreditRaw {
    campaignId: string;
    credit: string;
    initialCreditLevel: string;
    rankInInitialCreditLevel: string;
    numberOfReferees: string;
    currentCreditLevel: string;
    rewardEras: string;
}

interface IUserCredit {
    campaignId: number;
    credit: number;
    initialCreditLevel: string;
    rankInInitialCreditLevel: number;
    numberOfReferees: number;
    currentCreditLevel: string;
    rewardEras: number;
}

function convertUserCreditRaw(raw: IUserCreditRaw): IUserCredit {
    return {
        campaignId: Number(raw.campaignId),
        credit: Number(raw.credit),
        initialCreditLevel: raw.initialCreditLevel,
        rankInInitialCreditLevel: Number(raw.rankInInitialCreditLevel),
        numberOfReferees: Number(raw.numberOfReferees),
        currentCreditLevel: raw.currentCreditLevel,
        rewardEras: Number(raw.rewardEras),
    }
}

interface IAtRaw {
    hash: string;
    height: string;
}

// {
//     "at": {
//       "hash": "0xc5cd6b2d433722c0a788bea85f53d73846597d93120d79a6ef8ac4efb9505f08",
//       "height": "216"
//     },
//     "nonce": "0",
//     "tokenSymbol": "DPR",
//     "free": "10000000000000000000000000",
//     "reserved": "0",
//     "miscFrozen": "0",
//     "feeFrozen": "0",
//     "locks": []
//   }
interface IAccountBalanceResponse {
    at: IAtRaw;
    nonce: string;
    tokenSymbol: string;
    free: string;
    reserved: string;
    miscFrozen: string;
    feeFrozen: string;
}

interface IAccountBalance {
    nonce: number;
    tokenSymbol: string;
    free: BigInt;
    reserved: BigInt;
    miscFrozen: BigInt;
    feeFrozen: BigInt;
}

function convertAccountBalance(raw: IAccountBalanceResponse): IAccountBalance {
    return {
        nonce: parseInt(raw.nonce),
        tokenSymbol: raw.tokenSymbol,
        free: BigInt(raw.free),
        reserved: BigInt(raw.reserved),
        miscFrozen: BigInt(raw.miscFrozen),
        feeFrozen: BigInt(raw.feeFrozen),
    };
}

interface ITransactionMaterialResponse {
    at: IAtRaw;
    genesisHash: string;
    chainName: string;
    specName: string;
    specVersion: string;
    txVersion: string;
    metadata: `0x${string}`;
}

interface ITransactionMaterial {
    genesisHash: string;
    chainName: string;
    specName: 'deeper-chain';
    specVersion: number;
    txVersion: number;
    metadata: `0x${string}`;
}

function convertTransactionMaterial(raw: ITransactionMaterialResponse): ITransactionMaterial {
    return {
        genesisHash: raw.genesisHash,
        chainName: raw.chainName,
        specName: 'deeper-chain',
        specVersion: parseInt(raw.specVersion),
        txVersion: parseInt(raw.txVersion),
        metadata: raw.metadata,
    };
}

interface IBlockHeaderResponse {
    'number': string;
    hash: string;
}

interface IBlockHeader {
    'number': number;
    hash: string;
}

function convertBlockHeader(raw: IBlockHeaderResponse): IBlockHeader {
    return {
        'number': parseInt(raw.number),
        hash: raw.hash,
    };
}