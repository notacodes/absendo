import { useState } from 'react';
import PinEntry from '../components/PinEntry';

/**
 * Test page to demonstrate the PIN entry component
 * This can be used to test the PIN functionality without full authentication
 */
function PinTest() {
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [pinResult, setPinResult] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handlePinSubmit = async (pin: string, rememberDevice: boolean) => {
        setLoading(true);
        setError('');
        
        // Simulate some processing time
        setTimeout(() => {
            if (pin === '1234' && !isFirstTime) {
                // Simulate wrong PIN for demonstration
                setError('Ungültige PIN. Bitte versuchen Sie es erneut.');
                setLoading(false);
            } else {
                const trustState = rememberDevice ? 'trusted device' : 'do not trust device';
                setPinResult(`PIN entered: ${pin} (${isFirstTime ? 'First time setup' : 'Login'}, ${trustState})`);
                setIsPinModalOpen(false);
                setLoading(false);
            }
        }, 1500);
    };

    const handlePinCancel = () => {
        setIsPinModalOpen(false);
        setError('');
    };

    const openPinModal = (firstTime: boolean) => {
        setIsFirstTime(firstTime);
        setError('');
        setPinResult('');
        setIsPinModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-base-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">PIN Entry Component Test</h1>
                
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Test PIN-based Authentication</h2>
                        
                        <p className="mb-6">
                            This test demonstrates the PIN entry component that will be used for OAuth users
                            to enhance security through client-side encryption key derivation.
                        </p>

                        <div className="space-y-4">
                            <button 
                                className="btn btn-primary w-full"
                                onClick={() => openPinModal(true)}
                            >
                                Test First-Time PIN Setup
                            </button>
                            
                            <button 
                                className="btn btn-secondary w-full"
                                onClick={() => openPinModal(false)}
                            >
                                Test PIN Login
                            </button>
                        </div>

                        {pinResult && (
                            <div className="alert alert-success mt-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{pinResult}</span>
                            </div>
                        )}

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Security Features:</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li>4-6 digit PIN requirement</li>
                                <li>PIN confirmation for first-time setup</li>
                                <li>No PIN storage or transmission</li>
                                <li>Auto-focus and keyboard navigation</li>
                                <li>Paste support with digit filtering</li>
                                <li>Error handling and validation</li>
                                <li>PBKDF2 + SHA-512 key derivation (10,000 iterations)</li>
                                <li>Client-side salt management with IndexedDB</li>
                            </ul>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Test Instructions:</h3>
                            <div className="bg-base-300 p-4 rounded-lg">
                                <p><strong>First-Time Setup:</strong> Enter any 4-6 digit PIN, then confirm it.</p>
                                <p><strong>Login Test:</strong> Enter PIN "1234" to see error handling, or any other PIN for success.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PinEntry
                isOpen={isPinModalOpen}
                onSubmit={handlePinSubmit}
                onCancel={handlePinCancel}
                error={error}
                loading={loading}
                isFirstTime={isFirstTime}
            />
        </div>
    );
}

export default PinTest;
