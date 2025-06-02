// ForgotPassword.js
import { useState } from 'react';
import api from '~/ultis/httpsRequest';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await api.post('auth/forgot-password', { email });
        setMessage(res.data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Gửi link reset</button>
            <p>{message}</p>
        </form>
    );
}
export default ForgotPassword;
