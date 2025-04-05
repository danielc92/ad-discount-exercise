/*
    critical paths to test;

    1. SecondBite
    - Gets a 3 for 2 deal on Classic Ads
    2. Axil Coffee Roasters
    - Gets a discount on Stand out Ads where the price drops to $299.99 per ad
    3. MYER
    - Gets a 5 for 4 deal on Stand out Ads
    - Gets a discount on Premium Ads where the price drops to $389.99 per ad

*/

import { FixedDiscountPricingStrategy, GroupBuyPricingStrategy } from ".."
import { AdNameEnum, AllAds } from "../../Ads"

describe("PricingStrategy test suite", () => {
    describe("FixedDiscountPricingStrategy", () =>{

        it("should throw error when there number of ads is negative", () =>{
            const strategy = new FixedDiscountPricingStrategy(AdNameEnum.PREMIUM, {
                fixedDiscountAmount: 10,
            })
            expect(
             () => strategy.calculatePrice(-1)
            ).toThrow("totalNumberOfAds must be greater or equal to 0")
        })

        it("should return 0 when there are 0 items passed to calculatePrice()", () =>{
            const strategy = new FixedDiscountPricingStrategy(AdNameEnum.PREMIUM, {
                fixedDiscountAmount: 10,
            })
            expect(
            strategy.calculatePrice(0)
            ).toEqual(0)
        })

        it("should throw error fixedDiscountAmount is greater than the value of the ad", () =>{
            const strategy = new FixedDiscountPricingStrategy(AdNameEnum.PREMIUM, {
                fixedDiscountAmount: 999_999_999,
            })
            expect(
               () => strategy.calculatePrice(1)
            ).toThrow("fixedDiscountAmount must be less than the value of the ad: PREMIUM")
        })

        it("should throw error fixedDiscountAmount is less than 0", () =>{
            const strategy = new FixedDiscountPricingStrategy(AdNameEnum.PREMIUM, {
                fixedDiscountAmount: -10,
            })
            expect(
               () => strategy.calculatePrice(5)
            ).toThrow("fixedDiscountAmount must be a positive number")
        })

        it("should throw error when numbers are not supplied to calculatePrice()", () =>{
            const strategy = new FixedDiscountPricingStrategy(AdNameEnum.PREMIUM, {
                fixedDiscountAmount: undefined,
            })
            expect(
               () => strategy.calculatePrice(1)
            ).toThrow("fixedDiscountAmount and totalNumberOfAds must be of type number")
        })

        it("should calculate a price drop to 389.99 on 1 x premium ads", () =>{
            const currentAd = AdNameEnum.PREMIUM
            const currentAdPrice = AllAds[currentAd].retailPriceCentsAUD

            const strategy = new FixedDiscountPricingStrategy(currentAd, {
                // discount by $5 (500 cents)
                fixedDiscountAmount: 500,
               
            })
            expect(
                strategy.calculatePrice(1)
            ).toEqual(currentAdPrice - 500)
        })

        it("should calculate a price drop to 1169.97 on 3 x premium ads", () =>{
            const currentAd = AdNameEnum.PREMIUM
            const currentAdPrice = AllAds[currentAd].retailPriceCentsAUD
            const strategy = new FixedDiscountPricingStrategy(currentAd, {
                // discount by $5 (500 cents)
                fixedDiscountAmount: 500,
            
            })
            expect(
                strategy.calculatePrice(3)
            ).toEqual(3 * (currentAdPrice - 500))
        })
    })

    describe("GroupBuyPricingStrategy", () => {

        it("should return price of 0 when calculatePrice() receives 0 items", () =>{
            const strategy = new GroupBuyPricingStrategy(AdNameEnum.PREMIUM, {
                groupBuyLowerLimit: 1,
                groupBuyUpperLimit: 2,
            })
            expect(
              strategy.calculatePrice(0)
            ).toEqual(0)
        })


        it("should throw error when there number of ads is negative", () =>{
            const strategy = new GroupBuyPricingStrategy(AdNameEnum.PREMIUM, {
                groupBuyLowerLimit: 1,
                groupBuyUpperLimit: 2,
            })
            expect(
             () => strategy.calculatePrice(-1)
            ).toThrow("totalNumberOfAds must be greater or equal to 0")
        })

        it("should throw error when lower or upper limits are undefined", () => {
            const strategy = new GroupBuyPricingStrategy(AdNameEnum.CLASSIC, {
                groupBuyLowerLimit: undefined,
                groupBuyUpperLimit: undefined,
        
            })
            expect(
                () => strategy.calculatePrice(3)
            ).toThrow(
                "groupBuyLowerLimit, groupBuyUpperLimit and totalNumberOfAds must be of type number"
            )
        })

        it("should throw error when lower limit is less than 1", () => {
            const strategy = new GroupBuyPricingStrategy(AdNameEnum.CLASSIC, {
                groupBuyLowerLimit: 0,
                groupBuyUpperLimit: 3,
        
            })
            expect(
                () => strategy.calculatePrice(3)
            ).toThrow(
              "the lower limit must be at least 1"
            )
        })

        it("should throw error when upper limit is less than 2", () => {
            const strategy = new GroupBuyPricingStrategy(AdNameEnum.CLASSIC, {
                groupBuyLowerLimit: 10,
                groupBuyUpperLimit: 1,
        
            })
            expect(
                () => strategy.calculatePrice(3)
            ).toThrow(
               "the groupBuyUpperLimit must be at least 2"
            )
        })

        it("should throw error when upper limit is less than lower limit", () => {
            const strategy = new GroupBuyPricingStrategy(AdNameEnum.CLASSIC, {
                groupBuyLowerLimit: 10,
                groupBuyUpperLimit: 4,
          
            })
            expect(
                () => strategy.calculatePrice(3)
            ).toThrow(
               "the upper limit must be greater than the lower limit"
            )
        })

        it("should calculate price for a 3 for 2 deal on CLASSIC ads accurately", () => {
            const strategy = new GroupBuyPricingStrategy(AdNameEnum.CLASSIC, {
                groupBuyLowerLimit: 2,
                groupBuyUpperLimit: 3,
               
            })
            expect(
                strategy.calculatePrice(3)
            ).toEqual(
                AllAds.CLASSIC.retailPriceCentsAUD * 2
            )
        })

        it("should calculate price for a 5 for 4 deal on STAND_OUT ads accurately", () => {
            const strategy = new GroupBuyPricingStrategy(AdNameEnum.STAND_OUT, {
                groupBuyLowerLimit: 4,
                groupBuyUpperLimit: 5,
        
            })
            expect(
                strategy.calculatePrice(5)
            ).toEqual(
                AllAds.STAND_OUT.retailPriceCentsAUD * 4
            )
        })

        // this is not part of the exercise requirements but tests an edge case when you have remainder units
        it("should calculate price for a 5 for 4 deal on STAND_OUT ads accurately WITH REMAINDER", () => {
            const currentAd = AdNameEnum.STAND_OUT
            const currentAdPrice = AllAds[currentAd].retailPriceCentsAUD
            const strategy = new GroupBuyPricingStrategy(currentAd, {
                groupBuyLowerLimit: 4,
                groupBuyUpperLimit: 5,
            
            })
            expect(
                strategy.calculatePrice(7)
            ).toEqual(
                // should be 4 times the price (for the group buy) + 2 times for the remainder
                currentAdPrice * 4 +  currentAdPrice * 2
            )
        })
    })
})

