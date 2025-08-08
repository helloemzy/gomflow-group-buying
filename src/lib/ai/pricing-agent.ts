import { PricingRequest, PricingResponse, CountryCode } from '@/types';
import { getCountryConfig } from '@/lib/constants';

// Mock AI pricing agent for development
// In production, this would call OpenAI API
export async function getPricingRecommendation(request: PricingRequest): Promise<PricingResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { productCost, shippingCost, country, minOrders } = request;
  
  // Calculate base costs
  const totalCostPerUnit = productCost + shippingCost;
  
  // Calculate pricing tiers
  const conservativeMargin = 0.10; // 10% margin
  const balancedMargin = 0.15; // 15% margin
  const aggressiveMargin = 0.20; // 20% margin
  
  const conservativePrice = Math.round(totalCostPerUnit * (1 + conservativeMargin) * 100) / 100;
  const balancedPrice = Math.round(totalCostPerUnit * (1 + balancedMargin) * 100) / 100;
  const aggressivePrice = Math.round(totalCostPerUnit * (1 + aggressiveMargin) * 100) / 100;
  
  // Recommended price (balanced approach)
  const recommendedPrice = balancedPrice;
  const breakEvenPrice = totalCostPerUnit;
  const profitMargin = balancedMargin;
  
  // Generate reasoning based on country and category
  const reasoning = generateReasoning(country, minOrders, productCost, shippingCost);
  
  return {
    recommendedPrice,
    breakEvenPrice,
    profitMargin,
    pricePoints: {
      conservative: conservativePrice,
      balanced: balancedPrice,
      aggressive: aggressivePrice,
    },
    reasoning,
  };
}

function generateReasoning(
  country: CountryCode, 
  minOrders: number, 
  productCost: number, 
  shippingCost: number
): string {
  const countryConfig = getCountryConfig(country);
  const currency = countryConfig.currency;
  
  let reasoning = `Based on your ${countryConfig.name} market analysis:\n\n`;
  
  // Market-specific insights
  const marketInsights = getMarketInsights(country);
  reasoning += marketInsights;
  
  // Cost breakdown
  reasoning += `\n📊 Cost Breakdown:\n`;
  reasoning += `• Product cost: ${currency} ${productCost.toFixed(2)}\n`;
  reasoning += `• Shipping cost: ${currency} ${shippingCost.toFixed(2)}\n`;
  reasoning += `• Total cost per unit: ${currency} ${(productCost + shippingCost).toFixed(2)}\n`;
  reasoning += `• Minimum orders: ${minOrders}\n\n`;
  
  // Pricing strategy
  reasoning += `💡 Pricing Strategy:\n`;
  reasoning += `• Conservative (10% margin): ${currency} ${(productCost + shippingCost) * 1.1}\n`;
  reasoning += `• Balanced (15% margin): ${currency} ${(productCost + shippingCost) * 1.15}\n`;
  reasoning += `• Aggressive (20% margin): ${currency} ${(productCost + shippingCost) * 1.2}\n\n`;
  
  // Recommendations
  reasoning += `🎯 Recommendations:\n`;
  reasoning += `• Start with the balanced price for maximum appeal\n`;
  reasoning += `• Consider volume discounts for larger orders\n`;
  reasoning += `• Monitor competitor pricing in your region\n`;
  
  return reasoning;
}

function getMarketInsights(country: CountryCode): string {
  const insights: Record<CountryCode, string> = {
    ID: "🇮🇩 Indonesia: High demand for electronics and fashion. Competitive pricing is key.",
    MY: "🇲🇾 Malaysia: Strong e-commerce adoption. Focus on convenience and trust.",
    SG: "🇸🇬 Singapore: Premium market. Quality and reliability matter more than price.",
    HK: "🇭🇰 Hong Kong: Fast-paced market. Quick delivery and good deals are valued.",
    TW: "🇹🇼 Taiwan: Tech-savvy consumers. Digital payment methods preferred.",
    US: "🇺🇸 United States: Large market with diverse preferences. Convenience is key.",
    CA: "🇨🇦 Canada: Similar to US but with different shipping considerations.",
    BR: "🇧🇷 Brazil: Growing e-commerce market. Local payment methods important.",
    AR: "🇦🇷 Argentina: Economic volatility. Price stability is valued.",
    MX: "🇲🇽 Mexico: Growing middle class. Trust and local partnerships matter.",
    GB: "🇬🇧 United Kingdom: Mature market. Quality and customer service important.",
    FR: "🇫🇷 France: Quality-focused market. Sustainability considerations matter.",
    DE: "🇩🇪 Germany: Price-conscious but quality-focused. Transparent pricing works.",
    AU: "🇦🇺 Australia: Isolated market. Shipping costs are significant factor."
  };
  
  return insights[country] || "Market analysis based on regional trends and consumer behavior.";
}

// Helper function to validate pricing request
export function validatePricingRequest(request: PricingRequest): string | null {
  if (request.productCost <= 0) {
    return "Product cost must be greater than 0";
  }
  
  if (request.shippingCost < 0) {
    return "Shipping cost cannot be negative";
  }
  
  if (request.minOrders < 1) {
    return "Minimum orders must be at least 1";
  }
  
  if (request.minOrders > 1000) {
    return "Minimum orders cannot exceed 1000";
  }
  
  return null;
}
