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

import { Checkout } from ".."
import { AdNameEnum } from "../../Ads"
import { FixedDiscountPricingStrategy, GroupBuyPricingStrategy } from "../../PricingStrategy"


describe("Checkout test suite", () => {
    it("SecondBite: Checkout with 3 for 2 deal on classic ads", () => {
        const pricingStragies = [new GroupBuyPricingStrategy(AdNameEnum.CLASSIC, {groupBuyUpperLimit: 3, groupBuyLowerLimit: 2})]
        const checkout = new Checkout(pricingStragies)

        checkout.addItem(AdNameEnum.CLASSIC)
        checkout.addItem(AdNameEnum.CLASSIC)
        checkout.addItem(AdNameEnum.CLASSIC)

        const formattedPrice = checkout.showPrice()

        expect(formattedPrice).toEqual("$539.98")
    })

    it("Axil Coffee Roasters: they get 23$ (2300 cents) off all standout ads ", () => {

        const pricingStragies = [new FixedDiscountPricingStrategy(AdNameEnum.STAND_OUT, {fixedDiscountAmount: 2300})]
        const checkout = new Checkout(pricingStragies)

        // we will buy two to keep things simple
        checkout.addItem(AdNameEnum.STAND_OUT)
        checkout.addItem(AdNameEnum.STAND_OUT)

        const formattedPrice = checkout.showPrice()

        expect(formattedPrice).toEqual("$599.98")
    })

    it("MYER: 5 for 4 on stand out ads + 5$ discount on all premium ads", () => {

        const pricingStragies = [
            new FixedDiscountPricingStrategy(AdNameEnum.PREMIUM, {fixedDiscountAmount: 500}),
            new GroupBuyPricingStrategy(AdNameEnum.STAND_OUT, {groupBuyUpperLimit: 5, groupBuyLowerLimit: 4})
        ]

        const checkout = new Checkout(pricingStragies)

        checkout.addItem(AdNameEnum.PREMIUM)
        checkout.addItem(AdNameEnum.STAND_OUT)
        checkout.addItem(AdNameEnum.STAND_OUT)
        checkout.addItem(AdNameEnum.STAND_OUT)
        checkout.addItem(AdNameEnum.STAND_OUT)
        checkout.addItem(AdNameEnum.STAND_OUT)

        const formattedPrice = checkout.showPrice()

        expect(formattedPrice).toEqual("$1681.95")
    })

    // other test cases

    it("2 of each ad type without any strategies",  () => {

        const checkout = new Checkout()

        checkout.addItem(AdNameEnum.PREMIUM)
        checkout.addItem(AdNameEnum.PREMIUM)
        checkout.addItem(AdNameEnum.STAND_OUT)
        checkout.addItem(AdNameEnum.STAND_OUT)
        checkout.addItem(AdNameEnum.CLASSIC)
        checkout.addItem(AdNameEnum.CLASSIC)

        const formattedPrice = checkout.showPrice()

        expect(formattedPrice).toEqual("$1975.94")
    })

    it("1 premium without any strategies",  () => {

        const checkout = new Checkout()

        checkout.addItem(AdNameEnum.PREMIUM)

        const formattedPrice = checkout.showPrice()

        expect(formattedPrice).toEqual("$394.99")
    })

    it("1 classic without any strategies",  () => {

        const checkout = new Checkout()

        checkout.addItem(AdNameEnum.CLASSIC)

        const formattedPrice = checkout.showPrice()

        expect(formattedPrice).toEqual("$269.99")
    })

    it("1 standout without any strategies",  () => {

        const checkout = new Checkout()

        checkout.addItem(AdNameEnum.STAND_OUT)

        const formattedPrice = checkout.showPrice()

        expect(formattedPrice).toEqual("$322.99")
    })

})