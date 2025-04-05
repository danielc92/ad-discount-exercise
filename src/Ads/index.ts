enum AdNameEnum {
    CLASSIC = "CLASSIC",
    STAND_OUT = "STAND_OUT",
    PREMIUM = "PREMIUM"
}

type AllAdsType = {
    [key in AdNameEnum]: {
        // human friendly name
        name: string 
        // price in cents, in AUD currency
        retailPriceCentsAUD: number
        // description of the ad
        description: string
    }
    
}

// we can extend this object to include future ads, or modify existing ones on the fly
const AllAds: AllAdsType = {
    [AdNameEnum.CLASSIC]: {
        name: "Classic ad",
        retailPriceCentsAUD: 26999,
        description: "Classic Ad Offers the most basic level of advertisement"
    },
    [AdNameEnum.STAND_OUT]: {
        name: "Stand out ad",
        retailPriceCentsAUD: 32299,
        description: "Stand out Ad Allows advertisers to use a company logo and use a longer presentation text"
    },
    [AdNameEnum.PREMIUM]: {
        name: "Premium ad",
        retailPriceCentsAUD: 39499,
        description: "Premium Ad Same benefits as Standout Ad, but also puts the advertisement at the top of the results, allowing higher visibility"
    }
}

export {
    type AllAdsType,
    AdNameEnum,
    AllAds
}