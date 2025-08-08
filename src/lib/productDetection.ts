import { Product, ProductDetectionResult } from '@/types';

// Supported retailers and their URL patterns
const RETAILERS = {
  amazon: {
    pattern: /amazon\.(com|co\.uk|de|fr|it|es|ca|co\.jp)/,
    extractors: {
      title: () => document.querySelector('#productTitle')?.textContent?.trim(),
      price: () => {
        const priceElement = document.querySelector('.a-price-whole, .a-offscreen');
        if (priceElement) {
          const priceText = priceElement.textContent?.replace(/[^0-9.]/g, '');
          return priceText ? parseFloat(priceText) : null;
        }
        return null;
      },
      images: () => {
        const imgElement = document.querySelector('#landingImage, #imgBlkFront');
        return imgElement ? [imgElement.getAttribute('src') || ''] : [];
      },
    }
  },
  walmart: {
    pattern: /walmart\.com/,
    extractors: {
      title: () => document.querySelector('[data-testid="product-title"]')?.textContent?.trim(),
      price: () => {
        const priceElement = document.querySelector('[data-testid="price-wrap"] .price-characteristic');
        if (priceElement) {
          const priceText = priceElement.textContent?.replace(/[^0-9.]/g, '');
          return priceText ? parseFloat(priceText) : null;
        }
        return null;
      },
      images: () => {
        const imgElement = document.querySelector('[data-testid="hero-image"] img');
        return imgElement ? [imgElement.getAttribute('src') || ''] : [];
      },
    }
  },
  target: {
    pattern: /target\.com/,
    extractors: {
      title: () => document.querySelector('[data-test="product-title"]')?.textContent?.trim(),
      price: () => {
        const priceElement = document.querySelector('[data-test="product-price"]');
        if (priceElement) {
          const priceText = priceElement.textContent?.replace(/[^0-9.]/g, '');
          return priceText ? parseFloat(priceText) : null;
        }
        return null;
      },
      images: () => {
        const imgElement = document.querySelector('[data-test="product-image"] img');
        return imgElement ? [imgElement.getAttribute('src') || ''] : [];
      },
    }
  },
  costco: {
    pattern: /costco\.com/,
    extractors: {
      title: () => document.querySelector('.product-title')?.textContent?.trim(),
      price: () => {
        const priceElement = document.querySelector('.price');
        if (priceElement) {
          const priceText = priceElement.textContent?.replace(/[^0-9.]/g, '');
          return priceText ? parseFloat(priceText) : null;
        }
        return null;
      },
      images: () => {
        const imgElement = document.querySelector('.product-image img');
        return imgElement ? [imgElement.getAttribute('src') || ''] : [];
      },
    }
  },
  bestbuy: {
    pattern: /bestbuy\.com/,
    extractors: {
      title: () => document.querySelector('.heading-5')?.textContent?.trim(),
      price: () => {
        const priceElement = document.querySelector('.priceView-customer-price');
        if (priceElement) {
          const priceText = priceElement.textContent?.replace(/[^0-9.]/g, '');
          return priceText ? parseFloat(priceText) : null;
        }
        return null;
      },
      images: () => {
        const imgElement = document.querySelector('.primary-image img');
        return imgElement ? [imgElement.getAttribute('src') || ''] : [];
      },
    }
  }
};

// Mock product detection for development
const MOCK_PRODUCTS: Record<string, Product> = {
  'amazon': {
    title: 'Organic Coffee Beans - Premium Single Origin',
    price: 24.99,
    original_price: 34.99,
    shipping_cost: 8.99,
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'],
    url: 'https://amazon.com/dp/B08N5WRWNW',
    retailer: 'Amazon'
  },
  'walmart': {
    title: 'Bulk Coffee Beans - Colombian Medium Roast',
    price: 19.99,
    original_price: 29.99,
    shipping_cost: 5.99,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'],
    url: 'https://walmart.com/ip/123456',
    retailer: 'Walmart'
  },
  'target': {
    title: 'Premium Coffee Subscription - Monthly Delivery',
    price: 39.99,
    original_price: 49.99,
    shipping_cost: 0,
    images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'],
    url: 'https://target.com/p/123456',
    retailer: 'Target'
  },
  'costco': {
    title: 'Kirkland Signature Coffee - 3lb Bag',
    price: 14.99,
    original_price: 24.99,
    shipping_cost: 12.99,
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'],
    url: 'https://costco.com/item/123456',
    retailer: 'Costco'
  },
  'bestbuy': {
    title: 'Breville Coffee Maker - Barista Express',
    price: 599.99,
    original_price: 699.99,
    shipping_cost: 0,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    url: 'https://bestbuy.com/site/123456',
    retailer: 'Best Buy'
  }
};

export async function detectProduct(url: string): Promise<ProductDetectionResult> {
  try {
    // Validate URL
    if (!url || !url.startsWith('http')) {
      return {
        success: false,
        error: 'Please enter a valid URL'
      };
    }

    // Check if URL is from supported retailer
    const retailer = Object.entries(RETAILERS).find(([, config]) => 
      config.pattern.test(url)
    );

    if (!retailer) {
      return {
        success: false,
        error: 'We currently support Amazon, Walmart, Target, Costco, and Best Buy'
      };
    }

    // For development, return mock data based on retailer
    const retailerKey = retailer[0];
    if (process.env.NODE_ENV === 'development') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockProduct = MOCK_PRODUCTS[retailerKey];
      if (mockProduct) {
        return {
          success: true,
          product: {
            ...mockProduct,
            url: url
          }
        };
      }
    }

    // In production, this would make a server-side request to scrape the product page
    // For now, we'll return an error indicating this needs to be implemented
    return {
      success: false,
      error: 'Product detection is currently in development. Please try again later.'
    };

  } catch (error) {
    console.error('Product detection error:', error);
    return {
      success: false,
      error: 'Failed to detect product. Please check the URL and try again.'
    };
  }
}

export function getRetailerFromUrl(url: string): string | null {
  const retailer = Object.entries(RETAILERS).find(([, config]) => 
    config.pattern.test(url)
  );
  return retailer ? retailer[0] : null;
}

export function isValidProductUrl(url: string): boolean {
  return Object.values(RETAILERS).some(config => config.pattern.test(url));
}
