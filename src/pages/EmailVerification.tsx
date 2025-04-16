

export default function EmailVerificationCard() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="max-w-md w-full p-6 bg-base-100 rounded-lg shadow-lg">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4 flex items-center justify-center">
                        <span className="text-3xl">✉️</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Check Your Inbox! 📧</h2>
                    <p className="text-base-content/70 mb-6">
                        We've sent a verification link to your email.
                        Click it to activate your account and get started! 🚀
                    </p>

                    <div className="bg-base-200 p-4 rounded-lg w-full mb-6">
                        <div className="flex items-center space-x-3">
                            <span className="text-lg text-success">✓</span>
                            <span className="text-sm">Email sent successfully ✅</span>
                        </div>
                    </div>

                    <div className="space-y-4 w-full">
                        <button className="btn btn-primary w-full" onClick={() => window.location.href = '/login'}>
                            Login to your account 🔑
                        </button>
                        <button className="btn btn-outline w-full" onClick={() => window.location.href = '/home'}>
                            Back to Home 🏠
                        </button>
                    </div>

                    <p className="mt-6 text-sm text-base-content/60">
                        Having trouble? <a href="#" className="text-primary hover:underline">Hit up our support team! 🤙</a>
                    </p>
                </div>
            </div>
        </div>
    );
}