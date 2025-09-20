import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function NewPassword() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash.includes("access_token")) {
            setMessage("Invalid or expired link.");
        }
    }, []);

    const handleReset = async () => {
        if (!password || password !== confirm) {
            return setMessage("Passwords must match.");
        }

        const { error } = await supabase.auth.updateUser({ password });
        if (error) setMessage(error.message);
        else setMessage("Password updated! You can now log in.");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4 text-center">Set New Password</h2>
                {message && <p className="mb-4 text-red-600">{message}</p>}

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 mb-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleReset}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Set Password
                </button>
            </div>
        </div>
    );
}
