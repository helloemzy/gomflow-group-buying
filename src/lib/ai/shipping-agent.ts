import { ShippingRequest, ShippingResponse, CountryCode } from '@/types';
import { getCountryConfig } from '@/lib/constants';

// Mock AI shipping agent for development
// In production, this would call OpenAI API
export async function getShippingRecommendation(request: ShippingRequest): Promise<ShippingResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { orders, country, weight } = request;
  const countryConfig = getCountryConfig(country);
  
  // Calculate total items
  const totalItems = orders.reduce((sum, order) => sum + order.items, 0);
  
  // Generate shipping providers based on country
  const providers = generateShippingProviders(country, weight, totalItems);
  
  // Find best provider
  const bestProvider = providers.reduce((best, current) => 
    current.cost < best.cost ? current : best
  );
  
  // Generate bulk discounts
  const bulkDiscounts = generateBulkDiscounts(totalItems);
  
  // Generate recommendations
  const recommendations = generateRecommendations(country, totalItems, weight, bestProvider);
  
  return {
    providers,
    recommendations,
    bulkDiscounts,
  };
}

function generateShippingProviders(country: CountryCode, weight: number, totalItems: number): ShippingResponse['providers'] {
  const baseProviders = {
    // Southeast Asia
    ID: [
      { name: 'JNE Express', cost: 5.50, duration: '2-3 days', reliability: 0.95 },
      { name: 'SiCepat', cost: 4.80, duration: '3-4 days', reliability: 0.90 },
      { name: 'J&T Express', cost: 4.20, duration: '3-5 days', reliability: 0.88 },
      { name: 'Lion Parcel', cost: 6.00, duration: '2-3 days', reliability: 0.92 }
    ],
    MY: [
      { name: 'Pos Malaysia', cost: 6.20, duration: '2-3 days', reliability: 0.94 },
      { name: 'GD Express', cost: 5.80, duration: '2-4 days', reliability: 0.91 },
      { name: 'Ninja Van', cost: 5.50, duration: '1-2 days', reliability: 0.89 },
      { name: 'Lazada Express', cost: 6.50, duration: '2-3 days', reliability: 0.93 }
    ],
    SG: [
      { name: 'SingPost', cost: 8.50, duration: '1-2 days', reliability: 0.96 },
      { name: 'Ninja Van', cost: 7.80, duration: '1 day', reliability: 0.94 },
      { name: 'Qxpress', cost: 7.20, duration: '2-3 days', reliability: 0.92 },
      { name: 'DHL Express', cost: 12.00, duration: '1 day', reliability: 0.98 }
    ],
    HK: [
      { name: 'Hong Kong Post', cost: 9.20, duration: '1-2 days', reliability: 0.95 },
      { name: 'SF Express', cost: 8.80, duration: '1 day', reliability: 0.94 },
      { name: 'DHL Express', cost: 15.00, duration: '1 day', reliability: 0.99 },
      { name: 'FedEx', cost: 14.50, duration: '1 day', reliability: 0.98 }
    ],
    TW: [
      { name: 'Taiwan Post', cost: 7.80, duration: '2-3 days', reliability: 0.93 },
      { name: 'Black Cat', cost: 8.20, duration: '1-2 days', reliability: 0.94 },
      { name: 'SF Express', cost: 7.50, duration: '2-3 days', reliability: 0.92 },
      { name: 'DHL Express', cost: 13.00, duration: '1 day', reliability: 0.97 }
    ],
    // Americas
    US: [
      { name: 'USPS Priority', cost: 8.50, duration: '2-3 days', reliability: 0.94 },
      { name: 'FedEx Ground', cost: 9.20, duration: '3-5 days', reliability: 0.96 },
      { name: 'UPS Ground', cost: 9.80, duration: '3-5 days', reliability: 0.95 },
      { name: 'DHL Express', cost: 18.00, duration: '1-2 days', reliability: 0.98 }
    ],
    CA: [
      { name: 'Canada Post', cost: 12.50, duration: '3-5 days', reliability: 0.93 },
      { name: 'FedEx Ground', cost: 14.20, duration: '3-5 days', reliability: 0.95 },
      { name: 'UPS Standard', cost: 15.80, duration: '3-5 days', reliability: 0.94 },
      { name: 'DHL Express', cost: 22.00, duration: '1-2 days', reliability: 0.97 }
    ],
    BR: [
      { name: 'Correios', cost: 6.80, duration: '5-8 days', reliability: 0.85 },
      { name: 'Total Express', cost: 8.50, duration: '3-5 days', reliability: 0.90 },
      { name: 'Jadlog', cost: 7.20, duration: '4-6 days', reliability: 0.88 },
      { name: 'DHL Express', cost: 25.00, duration: '2-3 days', reliability: 0.95 }
    ],
    AR: [
      { name: 'Correo Argentino', cost: 5.20, duration: '5-10 days', reliability: 0.80 },
      { name: 'OCA', cost: 7.80, duration: '3-5 days', reliability: 0.88 },
      { name: 'Andreani', cost: 8.50, duration: '3-5 days', reliability: 0.90 },
      { name: 'DHL Express', cost: 28.00, duration: '2-3 days', reliability: 0.95 }
    ],
    MX: [
      { name: 'Correos de México', cost: 4.50, duration: '5-8 days', reliability: 0.82 },
      { name: 'Estafeta', cost: 6.80, duration: '3-5 days', reliability: 0.88 },
      { name: 'Redpack', cost: 7.20, duration: '3-5 days', reliability: 0.90 },
      { name: 'DHL Express', cost: 20.00, duration: '2-3 days', reliability: 0.94 }
    ],
    // Europe
    GB: [
      { name: 'Royal Mail', cost: 6.50, duration: '2-3 days', reliability: 0.94 },
      { name: 'DPD', cost: 7.80, duration: '1-2 days', reliability: 0.95 },
      { name: 'Hermes', cost: 6.20, duration: '2-3 days', reliability: 0.92 },
      { name: 'DHL Express', cost: 12.00, duration: '1 day', reliability: 0.97 }
    ],
    FR: [
      { name: 'La Poste', cost: 7.20, duration: '2-3 days', reliability: 0.93 },
      { name: 'Colissimo', cost: 8.50, duration: '1-2 days', reliability: 0.94 },
      { name: 'Chronopost', cost: 9.80, duration: '1 day', reliability: 0.95 },
      { name: 'DHL Express', cost: 15.00, duration: '1 day', reliability: 0.98 }
    ],
    DE: [
      { name: 'Deutsche Post', cost: 6.80, duration: '2-3 days', reliability: 0.94 },
      { name: 'DHL', cost: 8.20, duration: '1-2 days', reliability: 0.95 },
      { name: 'Hermes', cost: 6.50, duration: '2-3 days', reliability: 0.92 },
      { name: 'DHL Express', cost: 14.00, duration: '1 day', reliability: 0.97 }
    ],
    // Oceania
    AU: [
      { name: 'Australia Post', cost: 9.50, duration: '3-5 days', reliability: 0.94 },
      { name: 'Toll', cost: 11.20, duration: '2-3 days', reliability: 0.95 },
      { name: 'StarTrack', cost: 10.80, duration: '2-3 days', reliability: 0.93 },
      { name: 'DHL Express', cost: 18.00, duration: '1-2 days', reliability: 0.97 }
    ]
  };
  
  const providers = baseProviders[country] || baseProviders.US;
  
  // Adjust costs based on weight and volume
  return providers.map(provider => ({
    ...provider,
    cost: Math.round((provider.cost * (weight / 1000) * (totalItems > 10 ? 0.9 : 1)) * 100) / 100
  }));
}

function generateBulkDiscounts(totalItems: number): ShippingResponse['bulkDiscounts'] {
  const discounts = [];
  
  if (totalItems >= 50) {
    discounts.push({ quantity: 50, discount: 0.25 });
  }
  if (totalItems >= 25) {
    discounts.push({ quantity: 25, discount: 0.15 });
  }
  if (totalItems >= 10) {
    discounts.push({ quantity: 10, discount: 0.10 });
  }
  
  return discounts;
}

function generateRecommendations(
  country: CountryCode, 
  totalItems: number, 
  weight: number, 
  bestProvider: ShippingResponse['providers'][0]
): string {
  const countryConfig = getCountryConfig(country);
  const currency = countryConfig.currency;
  
  let recommendations = `🚚 Shipping Recommendations for ${countryConfig.name}:\n\n`;
  
  // Best provider recommendation
  recommendations += `⭐ Best Option: ${bestProvider.name}\n`;
  recommendations += `• Cost: ${currency} ${bestProvider.cost.toFixed(2)} per package\n`;
  recommendations += `• Delivery: ${bestProvider.duration}\n`;
  recommendations += `• Reliability: ${(bestProvider.reliability * 100).toFixed(0)}%\n\n`;
  
  // Bulk shipping advice
  if (totalItems >= 10) {
    recommendations += `📦 Bulk Shipping Benefits:\n`;
    recommendations += `• Volume discounts available\n`;
    recommendations += `• Consolidated shipping saves ${currency} ${(bestProvider.cost * 0.1).toFixed(2)} per package\n`;
    recommendations += `• Faster processing with bulk orders\n\n`;
  }
  
  // Country-specific advice
  const countryAdvice = getCountryShippingAdvice(country);
  recommendations += countryAdvice;
  
  // Weight considerations
  if (weight > 2000) {
    recommendations += `⚖️ Weight Considerations:\n`;
    recommendations += `• Heavy packages may require special handling\n`;
    recommendations += `• Consider splitting large orders\n`;
    recommendations += `• Insurance recommended for high-value items\n\n`;
  }
  
  // Cost optimization
  recommendations += `💰 Cost Optimization Tips:\n`;
  recommendations += `• Consolidate orders when possible\n`;
  recommendations += `• Use local pickup for nearby participants\n`;
  recommendations += `• Consider slower shipping for non-urgent items\n`;
  
  return recommendations;
}

function getCountryShippingAdvice(country: CountryCode): string {
  const advice: Record<CountryCode, string> = {
    ID: "🇮🇩 Indonesia: Use local couriers for better reliability. Consider cash on delivery for rural areas.",
    MY: "🇲🇾 Malaysia: E-commerce friendly. Most providers offer tracking and insurance.",
    SG: "🇸🇬 Singapore: Premium market. Fast delivery expected. Consider express options for urgent orders.",
    HK: "🇭🇰 Hong Kong: Dense urban area. Same-day delivery available. Consider local pickup points.",
    TW: "🇹🇼 Taiwan: Tech-savvy logistics. Most providers offer real-time tracking.",
    US: "🇺🇸 United States: Large country with varied delivery times. Consider regional distribution centers.",
    CA: "🇨🇦 Canada: Similar to US but with different customs considerations. Use tracked shipping.",
    BR: "🇧🇷 Brazil: Complex logistics. Use established providers. Consider import taxes.",
    AR: "🇦🇷 Argentina: Economic considerations important. Use local providers for better rates.",
    MX: "🇲🇽 Mexico: Growing logistics network. Consider border shipping for northern regions.",
    GB: "🇬🇧 United Kingdom: Mature logistics market. Most providers offer next-day delivery.",
    FR: "🇫🇷 France: Good logistics infrastructure. Consider environmental shipping options.",
    DE: "🇩🇪 Germany: Efficient logistics. Most providers offer same-day delivery in major cities.",
    AU: "🇦🇺 Australia: Isolated market. Shipping costs are significant. Consider local distribution."
  };
  
  return advice[country] || "Use established providers with good tracking and insurance options.\n\n";
}

// Helper function to validate shipping request
export function validateShippingRequest(request: ShippingRequest): string | null {
  if (!request.orders || request.orders.length === 0) {
    return "At least one order is required";
  }
  
  if (request.weight <= 0) {
    return "Weight must be greater than 0";
  }
  
  if (request.weight > 50000) { // 50kg limit
    return "Weight cannot exceed 50kg";
  }
  
  for (const order of request.orders) {
    if (order.items <= 0) {
      return "Each order must have at least 1 item";
    }
    if (!order.address || order.address.trim() === '') {
      return "All orders must have valid addresses";
    }
  }
  
  return null;
}
