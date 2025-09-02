import { useState, useRef, useEffect } from 'react';
import E2EEModal from "./E2EEModal.tsx";

interface PinEntryProps {
  isOpen: boolean;
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  error?: string;
  loading?: boolean;
  isFirstTime?: boolean;
}

const PinEntry = ({ 
  isOpen, 
  onSubmit, 
  onCancel, 
  error, 
  loading = false,
  isFirstTime = false 
}: PinEntryProps) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [isConfirming, setIsConfirming] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isE2EEModalOpen, setIsE2EEModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '', '', '']);
      setConfirmPin(['', '', '', '', '', '']);
      setIsConfirming(false);
      setLocalError('');
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
    if(isFirstTime && !isConfirming){
      setIsE2EEModalOpen(true);
    }
  }, [isOpen]);

  // Clear local error when pin changes
  useEffect(() => {
    if (localError) {
      setLocalError('');
    }
  }, [pin, confirmPin, localError]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Only allow single digit
    if (value.length > 1) return;

    const currentArray = isConfirming ? confirmPin : pin;
    const setCurrentArray = isConfirming ? setConfirmPin : setPin;
    
    const newArray = [...currentArray];
    newArray[index] = value;
    setCurrentArray(newArray);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const currentArray = isConfirming ? confirmPin : pin;
    
    if (e.key === 'Backspace' && !currentArray[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length >= 4) {
      const newArray = digits.split('').concat(['', '', '', '', '', '']).slice(0, 6);
      if (isConfirming) {
        setConfirmPin(newArray);
      } else {
        setPin(newArray);
      }
      
      // Focus last filled input
      const lastIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const validatePin = (pinArray: string[]): boolean => {
    const pinString = pinArray.join('');
    return pinString.length >= 4 && pinString.length <= 6;
  };

  const handleSubmit = () => {
    if (loading) return;

    const currentPin = pin.join('');
    
    if (!validatePin(pin)) {
      setLocalError('PIN muss 4-6 Ziffern haben');
      return;
    }

    if (isFirstTime && !isConfirming) {
      setIsConfirming(true);
      setConfirmPin(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      return;
    }

    if (isFirstTime && isConfirming) {
      setIsE2EEModalOpen(false);
      const confirmPinString = confirmPin.join('');
      if (currentPin !== confirmPinString) {
        setLocalError('PINs stimmen nicht überein');
        setIsConfirming(false);
        setPin(['', '', '', '', '', '']);
        setConfirmPin(['', '', '', '', '', '']);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
        return;
      }
    }

    onSubmit(currentPin);
  };

  const handleBack = () => {
    setIsConfirming(false);
    setConfirmPin(['', '', '', '', '', '']);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const currentArray = isConfirming ? confirmPin : pin;
  const displayError = error || localError;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <E2EEModal
          isOpen={isE2EEModalOpen}
          onClose={() => setIsE2EEModalOpen(false)}
      />
      <div className="bg-base-100 rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center mb-2">
          {isFirstTime 
            ? (isConfirming ? 'PIN bestätigen' : 'Sicherheits-PIN festlegen') 
            : 'PIN eingeben'
          }
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          {isFirstTime 
            ? (isConfirming 
              ? 'Bitte geben Sie Ihre PIN erneut ein' 
              : 'Erstellen Sie eine 4-6 stellige PIN für zusätzliche Sicherheit'
            )
            : 'Geben Sie Ihre PIN ein, um fortzufahren'
          }
        </p>

        <div className="flex justify-center space-x-2 mb-6">
          {currentArray.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:border-primary ${
                displayError ? 'border-error' : 'border-gray-300'
              }`}
              disabled={loading}
              autoComplete="off"
              data-form-type="other"
            />
          ))}
        </div>

        {displayError && (
          <div className="text-error text-center mb-4 text-sm">
            {displayError}
          </div>
        )}

        <div className="flex space-x-3">
          {isFirstTime && isConfirming && (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-outline flex-1"
              disabled={loading}
            >
              Zurück
            </button>
          )}
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !validatePin(currentArray)}
            className="btn btn-primary flex-1"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Verarbeitung...
              </>
            ) : (
              isFirstTime && !isConfirming ? 'Weiter' : 'Bestätigen'
            )}
          </button>
          
          {!isFirstTime && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
              disabled={loading}
            >
              Abbrechen
            </button>
          )}
        </div>

        {isFirstTime && !isConfirming && (
            <div className="mb-4 mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm rounded">
              <p><strong>Wichtiger Hinweis:</strong> Ohne dein PIN kannst du nicht mehr auf deine Daten zugreifen.</p>
            </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Ihre PIN wird niemals gespeichert oder übertragen.</p>
          <p>Sie wird nur zur lokalen Verschlüsselung verwendet.</p>
        </div>
      </div>
    </div>
  );
};

export default PinEntry;
