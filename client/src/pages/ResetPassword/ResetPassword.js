// ResetPassword.js
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '~/ultis/httpsRequest';

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        const res = await api.post(`auth/reset-password/${token}`, { password });
        setMessage(res.data.message);
    };

    return (
        <form onSubmit={handleReset}>
            <input
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Cập nhật mật khẩu</button>
            <p>{message}</p>
        </form>
    );
}
export default ResetPassword;
