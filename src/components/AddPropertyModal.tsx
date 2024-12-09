import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TURKISH_CITIES, NEIGHBORHOODS } from '../constants/locations';
import { Property } from '../types';
import { MediaUpload } from './MediaUpload';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { SignupModal } from './SignupModal';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (property: Omit<Property, 'id' | 'createdAt' | 'expiresAt' | 'isActive'>) => void;
}

export function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    neighborhood: '',
    roomType: '1+0',
    bathrooms: '',
    area: '',
    imageUrl: '',
    images: [] as string[],
    videoUrl: '',
    type: 'apartment',
    amenities: [] as string[],
    furnished: false,
    petFriendly: false,
    features: [] as string[],
    contact: {
      name: currentUser?.displayName || '',
      phone: '',
      email: currentUser?.email || '',
      whatsapp: ''
    }
  });

  if (!isOpen) return null;

  // If user is not logged in, show login/signup prompt
  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to post a property. Please log in or create an account to continue.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignupModal(true)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sign Up
            </button>
          </div>

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => {
              setShowLoginModal(false);
              onClose();
            }}
            onSwitchToSignup={() => {
              setShowLoginModal(false);
              setShowSignupModal(true);
            }}
          />
          <SignupModal
            isOpen={showSignupModal}
            onClose={() => {
              setShowSignupModal(false);
              onClose();
            }}
            onSwitchToLogin={() => {
              setShowSignupModal(false);
              setShowLoginModal(true);
            }}
          />
        </div>
      </div>
    );
  }

  // Rest of the component code remains the same...
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const location = {
      lat: 41.0082,
      lng: 28.9784
    };

    onAdd({
      ...formData,
      price: Number(formData.price),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
      city: selectedCity as any,
      location,
      bedrooms: formData.type === 'room' 
        ? Number(formData.roomType)
        : parseInt(formData.roomType.split('+')[0])
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Property</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Rest of the form JSX remains the same... */}
      </div>
    </div>
  );
}