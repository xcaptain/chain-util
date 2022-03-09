import axios, { AxiosInstance } from 'axios';

class SideCar {
    readonly client: AxiosInstance;
    cachedNonce: number;

    constructor(sideCarURL: string, timeoutMs: number) {
        this.client = axios.create({
            baseURL: sideCarURL,
            timeout: timeoutMs,
            headers: { 'Content-Type': 'application/json' },
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
}

export const testSideCar = new SideCar('http://127.0.0.1:8080', 10000);

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
        nonce: Number.parseInt(raw.nonce),
        tokenSymbol: raw.tokenSymbol,
        free: BigInt(raw.free),
        reserved: BigInt(raw.reserved),
        miscFrozen: BigInt(raw.miscFrozen),
        feeFrozen: BigInt(raw.feeFrozen),
    };
}