export const config = [

    {
        id: "kujira", values: 
        {
            "chainId": "kaiyo-1",
            "chainName": "Kujira",
            "rpc": "https://rpc-kujira.synergynodes.com",
            "rest": "https://lcd-kujira.synergynodes.com",
            "bip44": {
                "coinType": 118
            },
            "bech32Config": {
                "bech32PrefixAccAddr": "kujira",
                "bech32PrefixAccPub": "kujirapub",
                "bech32PrefixValAddr": "kujiravaloper",
                "bech32PrefixValPub": "kujiravaloperpub",
                "bech32PrefixConsAddr": "kujiravalcons",
                "bech32PrefixConsPub": "kujiravalconspub"
            },
            "currencies": [ 
                { 
                    "coinDenom": "KUJI", 
                    "coinMinimalDenom": "ukuji", 
                    "coinDecimals": 6, 
                    "coinGeckoId": "kujira"
                }
            ],
            "feeCurrencies": [
                { 
                    "coinDenom": "KUJI", 
                    "coinMinimalDenom": "ukuji", 
                    "coinDecimals": 6, 
                    "coinGeckoId": "kujira"
                }
            ],
            "stakeCurrency": { 
                    "coinDenom": "KUJI", 
                    "coinMinimalDenom": "ukuji", 
                    "coinDecimals": 6, 
                    "coinGeckoId": "kujira"
            },
            "coinType": 118,
            "gasPriceStep": {
                "low": 0.01,
                "average": 0.025,
                "high": 0.03
            }
        }
    }
    
];