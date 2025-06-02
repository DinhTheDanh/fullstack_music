import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '~/context/AppProvider';

function ProtectedRoute({ children, requiredRole }) {
    const { user } = useContext(AppContext);

    if (!user) {
        return <Navigate to="/login" />;
    }
    if (requiredRole && user !== user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;
