'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { notificationService } from '@/lib/services/notifications';
import NotificationCenter from './NotificationCenter';
import Badge from '@/components/ui/Badge';

const NotificationBell: React.FC = () => {
  const { user } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, loadUnreadCount]);

  const loadUnreadCount = async () => {
    if (!user) return;
    
    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleBellClick = () => {
    setIsOpen(true);
    // Refresh unread count when opening
    loadUnreadCount();
  };

  if (!user) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={handleBellClick}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
          
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge variant="error" className="text-xs px-1.5 py-0.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </motion.div>
          )}
        </button>
      </div>

      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default NotificationBell;
