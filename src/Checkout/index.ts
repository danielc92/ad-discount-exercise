import { AdNameEnum, AllAds } from "../Ads"
import { FixedDiscountPricingStrategy, GroupBuyPricingStrategy, PricingStrategyBase } from "../PricingStrategy"


type PricingStrategyOrNull = GroupBuyPricingStrategy | FixedDiscountPricingStrategy | null

// Checkout constructor takes in a list of Pricing Strategies
type CheckoutConstructorOptions =  Array<GroupBuyPricingStrategy | FixedDiscountPricingStrategy>


type PricingStrategyMap = {
    [key in AdNameEnum]: PricingStrategyOrNull
}

// the default if not supplied will be no stragey for each ad type
const DEFAULT_PRICING_STRATEGY: PricingStrategyMap = {
    CLASSIC: null,
    PREMIUM: null,
    STAND_OUT: null
}

const getPricingStrategyMapFromList = (pricingList: CheckoutConstructorOptions ) : PricingStrategyMap=> {

    const pricingMap = pricingList.reduce(
        (map, pricingStrategy) => {
            const adName = pricingStrategy.getAdName()
            map[adName] = pricingStrategy
            return map
        }, 
        {...DEFAULT_PRICING_STRATEGY}
    )

    return pricingMap
}



class Checkout {

    // number of each ad for this checkout
    adCounts: {
        [key in AdNameEnum]: number
    }

    pricingStrategies: {
        [key in AdNameEnum]: PricingStrategyOrNull
    }

    totalPriceInCents: number

    constructor(pricingStrategies?: CheckoutConstructorOptions){
        // initialise with 0 for each ad
        this.adCounts = {
            CLASSIC: 0,
            PREMIUM: 0,
            STAND_OUT: 0
        }
        this.pricingStrategies = getPricingStrategyMapFromList(pricingStrategies ?? [])
        this.totalPriceInCents = 0
    }

    // increment the ad count for a particular ad name
    // this uses the builder pattern, such that multiple calls can be used in a row
    addItem = (adName: AdNameEnum) => {
        this.adCounts[adName] += 1
        return this
    }

    // calculates the price total without any formatting
    // the calculation pathway is simplified here as you either have a pricing strategy 
    // (something that extends the PricingStrategyBase abstract class) or you use the default one
    calculatePriceInCents = () => {
        
        this.totalPriceInCents = Object.values(AdNameEnum).reduce((total, adName) => {
            if (this.pricingStrategies[adName] instanceof PricingStrategyBase) {
                const subtotal = this.pricingStrategies[adName].calculatePrice(this.adCounts[adName])
                total += subtotal
            } 
            else {
                // default pricing strategy is to use the original prices multiplied by the count of ads
                total += (AllAds[adName].retailPriceCentsAUD * this.adCounts[adName])
            }
            return total
        }, 0)

    }

    // calculates the cents price and displays it in a user friendly manner
    showPrice = (): string => {
        this.calculatePriceInCents()
        return `$${this.totalPriceInCents/100}`
    }
}


export {
    Checkout
}