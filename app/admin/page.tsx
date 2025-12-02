'use client';

import { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';

export default function AdminPage() {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        async (result) => {
          setScanResult(result.data);
          await verifyTicket(result.data);
          stopScanning();
        },
        {
          returnDetailedScanResult: true,
        }
      );

      await qrScannerRef.current.start();
      setScanning(true);
    } catch (error) {
      console.error('Error starting scanner:', error);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
    setScanning(false);
  };

  const verifyTicket = async (qrData: string) => {
    try {
      const ticketData = JSON.parse(qrData);
      const ticketDoc = doc(db, 'tickets', ticketData.ticketId);
      const ticketSnap = await getDoc(ticketDoc);

      if (!ticketSnap.exists()) {
        setVerificationStatus('error');
        return;
      }

      const ticket = ticketSnap.data();
      
      if (ticket.isUsed) {
        setVerificationStatus('error');
        return;
      }

      // Mark ticket as used
      await updateDoc(ticketDoc, {
        isUsed: true,
        entryTime: new Date().toISOString(),
      });

      // Update event entry count
      const eventDoc = doc(db, 'events', ticket.eventId);
      await updateDoc(eventDoc, {
        enteredCount: increment(1),
      });

      setVerificationStatus('success');
    } catch (error) {
      console.error('Error verifying ticket:', error);
      setVerificationStatus('error');
    }
  };

  if (!user?.isAdmin) {
    return <div className="text-center py-8">Access denied. Admin only.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">QR Code Scanner</h2>
        
        <div className="text-center">
          <video
            ref={videoRef}
            className="w-full h-64 bg-black rounded-lg mb-4"
            style={{ display: scanning ? 'block' : 'none' }}
          />
          
          {!scanning ? (
            <button
              onClick={startScanning}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Stop Scanning
            </button>
          )}
        </div>

        {verificationStatus && (
          <div className={`mt-4 p-4 rounded-lg ${
            verificationStatus === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {verificationStatus === 'success'
              ? 'Ticket verified successfully!'
              : 'Invalid or already used ticket!'}
          </div>
        )}

        {scanResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-medium">Last scan result:</p>
            <p className="text-xs break-all">{scanResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
