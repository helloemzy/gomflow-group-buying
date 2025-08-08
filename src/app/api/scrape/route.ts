import { NextRequest, NextResponse } from 'next/server';
import { detectProduct } from '@/lib/productDetection';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // For development, return mock data
    // In production, this would scrape the actual product page
    const mockProducts = {
      'amazon.com': {
        title: 'Organic Coffee Beans - Premium Single Origin',
        price: 24.99,
        original_price: 34.99,
        shipping_cost: 8.99,
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'],
        url: url,
        retailer: 'Amazon'
      },
      'walmart.com': {
        title: 'Bulk Coffee Beans - Colombian Medium Roast',
        price: 19.99,
        original_price: 29.99,
        shipping_cost: 5.99,
        images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'],
        url: url,
        retailer: 'Walmart'
      },
      'target.com': {
        title: 'Premium Coffee Subscription - Monthly Delivery',
        price: 39.99,
        original_price: 49.99,
        shipping_cost: 0,
        images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'],
        url: url,
        retailer: 'Target'
      },
      'costco.com': {
        title: 'Kirkland Signature Coffee - 3lb Bag',
        price: 14.99,
        original_price: 24.99,
        shipping_cost: 12.99,
        images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'],
        url: url,
        retailer: 'Costco'
      },
      'bestbuy.com': {
        title: 'Breville Coffee Maker - Barista Express',
        price: 599.99,
        original_price: 699.99,
        shipping_cost: 0,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
        url: url,
        retailer: 'Best Buy'
      }
    };

    // Determine retailer from URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const retailer = Object.keys(mockProducts).find(key => hostname.includes(key));

    if (!retailer) {
      return NextResponse.json(
        { error: 'Unsupported retailer. We currently support Amazon, Walmart, Target, Costco, and Best Buy.' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const product = mockProducts[retailer as keyof typeof mockProducts];

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Product scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape product information' },
      { status: 500 }
    );
  }
}
