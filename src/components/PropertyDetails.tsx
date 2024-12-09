{/* Previous imports remain the same */}
import { useAuth } from '../contexts/AuthContext';
import { Trash2 } from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
  reviews: Review[];
  onClose: () => void;
  onDelete?: (propertyId: string) => void;
}

export function PropertyDetails({ property, reviews, onClose, onDelete }: PropertyDetailsProps) {
  const { currentUser } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const images = [property.imageUrl, ...(property.images || [])];

  // Rest of the existing code remains the same until the contact information section

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Existing image gallery and close button */}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin size={16} />
              <span>{property.neighborhood}, {property.city}</span>
            </div>
            
            {/* Add delete button if user owns the property */}
            {currentUser?.email === property.contact.email && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete Property"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          {/* Rest of the existing content */}

          {/* Add delete confirmation modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
              <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
                <h3 className="text-xl font-bold mb-4">Delete Property</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this property? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      onDelete(property.id);
                      onClose();
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}