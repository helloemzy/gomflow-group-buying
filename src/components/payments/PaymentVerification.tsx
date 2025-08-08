'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';
import { getTimeAgo } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface PaymentParticipant {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  payment_method: string;
  payment_amount: number;
  payment_proof_url?: string;
  payment_status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  joined_at: string;
  verified_at?: string;
  verified_by?: string;
}

interface PaymentVerificationProps {
  participants: PaymentParticipant[];
  onVerify: (participantId: string, status: 'verified' | 'rejected') => Promise<void>;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({
  participants,
  onVerify
}) => {
  const { user } = useAppStore();
  const [verifying, setVerifying] = useState<string | null>(null);

  const handleVerification = async (participantId: string, status: 'verified' | 'rejected') => {
    setVerifying(participantId);
    try {
      await onVerify(participantId, status);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setVerifying(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'uploaded':
        return <Badge variant="warning">Pending Review</Badge>;
      default:
        return <Badge variant="info">No Payment</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'uploaded':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payment Verification</h3>
        <div className="text-sm text-gray-500">
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </div>
      </div>

      {participants.length === 0 ? (
        <Card className="p-6 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">No participants yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {participants.map((participant) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {participant.user.avatar_url ? (
                      <img
                        src={participant.user.avatar_url}
                        alt={participant.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {participant.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{participant.user.name}</div>
                    <div className="text-sm text-gray-500">{participant.user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(participant.payment_status)}
                  {getStatusBadge(participant.payment_status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="ml-1 font-medium">
                    {formatCurrency(participant.payment_amount, 'USD')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Method:</span>
                  <span className="ml-1 font-medium capitalize">
                    {participant.payment_method}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Joined:</span>
                  <span className="ml-1">{getTimeAgo(participant.joined_at)}</span>
                </div>
                {participant.verified_at && (
                  <div>
                    <span className="text-gray-500">Verified:</span>
                    <span className="ml-1">{getTimeAgo(participant.verified_at)}</span>
                  </div>
                )}
              </div>

              {participant.payment_proof_url && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Payment Proof:</span>
                    <a
                      href={participant.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </a>
                    <a
                      href={participant.payment_proof_url}
                      download
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              )}

              {participant.payment_status === 'uploaded' && user && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleVerification(participant.id, 'verified')}
                    disabled={verifying === participant.id}
                    size="sm"
                    variant="success"
                  >
                    {verifying === participant.id ? 'Verifying...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleVerification(participant.id, 'rejected')}
                    disabled={verifying === participant.id}
                    size="sm"
                    variant="error"
                  >
                    {verifying === participant.id ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
