import { AdNameEnum, AllAds, type AllAdsType} from "../Ads"

type CalculatePriceInput = {
    groupBuyLowerLimit?: number
    groupBuyUpperLimit?: number
    fixedDiscountAmount?: number
}

// Other pricing strategies can extend this class as they will have some things in common
// the base class will store information about the ads, as well as the ad that the pricing strategy is targetted for (currentAd)
abstract class PricingStrategyBase {
    
    // each pricing strategy can calculate the price in cents given a number of ads
    abstract calculatePrice(totalNumberOfAds: number): number;

    // each pricing strategy can validate inputs and throw errors
    abstract validateInputs(totalNumberOfAds: number): void;

    ads: AllAdsType
    currentAd: AdNameEnum
    calculatePriceInput: CalculatePriceInput
    
    constructor(adName: AdNameEnum, calculatePriceInput: CalculatePriceInput){
        this.ads = AllAds
        this.currentAd = adName
        this.calculatePriceInput = calculatePriceInput
    }

    getAdName = () => this.currentAd

    

}

// if a user purchases x amount they get a discount, assuming that these discounts can stack up
// for example if the strategy is buy 3 for 2, if they buy 6, they will get 4
class GroupBuyPricingStrategy extends PricingStrategyBase {

  

    validateInputs(totalNumberOfAds: number): void {
        const { groupBuyLowerLimit, groupBuyUpperLimit} = this.calculatePriceInput;
        // validation of inputs
        if (typeof totalNumberOfAds !== "number" || 
            typeof groupBuyLowerLimit !== "number" || 
            typeof groupBuyUpperLimit !== "number") throw new Error("groupBuyLowerLimit, groupBuyUpperLimit and totalNumberOfAds must be of type number")

        if (totalNumberOfAds < 0) throw new Error("totalNumberOfAds must be greater or equal to 0")
        // '2 for 1' is the minimmum allowed input for this strategy, for the sake of this exercise there is no upper limit and it is flexible
        if (groupBuyUpperLimit < 2) throw new Error("the groupBuyUpperLimit must be at least 2")
        if (groupBuyLowerLimit < 1) throw new Error("the lower limit must be at least 1")
            
        if (groupBuyUpperLimit <= groupBuyLowerLimit) throw new Error("the upper limit must be greater than the lower limit")
    }

    calculatePrice(totalNumberOfAds: number): number {

        if (totalNumberOfAds === 0) return 0

        const { groupBuyLowerLimit = 0, groupBuyUpperLimit = 0} = this.calculatePriceInput;
        
        this.validateInputs(totalNumberOfAds)

        // calculate the total price for this ad
        const currentAdPrice = this.ads[this.currentAd].retailPriceCentsAUD
        const numberOfGroups = Math.floor(totalNumberOfAds / groupBuyUpperLimit)
        const remainderNumberOfAds = totalNumberOfAds % groupBuyUpperLimit
        const totalPrice = (numberOfGroups * (currentAdPrice * groupBuyLowerLimit)) + (remainderNumberOfAds * currentAdPrice) 
        return totalPrice

    }
}

// if a user buys any amount of a particular ad, they will get a fixed dollar amount discount
class FixedDiscountPricingStrategy extends PricingStrategyBase {


    validateInputs(totalNumberOfAds: number) {
        const {fixedDiscountAmount} = this.calculatePriceInput;
        const currentAdPrice = this.ads[this.currentAd].retailPriceCentsAUD
        // validation of inputs
        if (typeof fixedDiscountAmount !== "number" || typeof totalNumberOfAds !== "number") {
            throw new  Error("fixedDiscountAmount and totalNumberOfAds must be of type number")
        } 

        if (totalNumberOfAds < 0) throw new Error("totalNumberOfAds must be greater or equal to 0")

        if (fixedDiscountAmount <=0) {
            throw new Error("fixedDiscountAmount must be a positive number")
        }

        // the discount cant be higher than the value of the ad itself
        if (fixedDiscountAmount > currentAdPrice) throw new Error(`fixedDiscountAmount must be less than the value of the ad: ${this.currentAd}`)
          
    }

    calculatePrice(totalNumberOfAds: number): number {

        if (totalNumberOfAds === 0) return 0

        this.validateInputs(totalNumberOfAds)

        const {fixedDiscountAmount} = this.calculatePriceInput;

        // calculate the total price for this ad
        const currentAdPrice = this.ads[this.currentAd].retailPriceCentsAUD

       
        const totalPrice = totalNumberOfAds * (currentAdPrice - (fixedDiscountAmount ?? 0))

        return totalPrice
}
}

export {
    PricingStrategyBase,
    GroupBuyPricingStrategy,
    FixedDiscountPricingStrategy
}