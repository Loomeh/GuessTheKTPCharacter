

export default function InfoCard() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
                <p className="text-lg text-gray-800 mb-4">
                    This is a game where you have to guess the character from the Kill The Past game series based on limited information.
                </p>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Come back tomorrow for a new character!</p>
                </div>
            </div>
        </div>
    );
}