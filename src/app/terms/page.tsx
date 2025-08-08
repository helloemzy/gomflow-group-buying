'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TermsPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">Terms of Service</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using GOMFLOW, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-6">
              GOMFLOW is a group buying platform that enables users to organize and participate in bulk purchases. 
              Users can create group orders, invite participants, and save money through collective buying power.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must comply with all applicable laws and regulations</li>
              <li>You are responsible for the accuracy of product information you provide</li>
              <li>You must handle payments and shipping arrangements responsibly</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Payment and Shipping</h2>
            <p className="text-gray-700 mb-6">
              GOMFLOW facilitates group orders but does not process payments directly. 
              All payments are handled between participants and order managers. 
              Shipping arrangements are the responsibility of the order manager.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Dispute Resolution</h2>
            <p className="text-gray-700 mb-6">
              In case of disputes between participants, GOMFLOW will attempt to mediate but is not responsible for resolving conflicts. 
              Users are encouraged to communicate directly to resolve issues.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Privacy</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy" className="text-emerald-600 hover:text-emerald-500">
                Privacy Policy
              </Link>{' '}
              which also governs your use of the service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              GOMFLOW is provided "as is" without warranties of any kind. 
              We are not responsible for any losses, damages, or injuries resulting from the use of our service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. 
              Continued use of the service after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@gomflow.com" className="text-emerald-600 hover:text-emerald-500">
                support@gomflow.com
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/signup">
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Accept and Continue
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
