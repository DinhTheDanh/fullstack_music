import { useEffect, useState } from 'react';
import Playlist from '~/components/Playlist';
import api from '~/ultis/httpsRequest';

function Profile() {
    const [user, setUser] = useState([]);
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchApi(page);
    }, []);

    const fetchApi = async (pageNum) => {
        try {
            const res = await api.get(`auth/favorite-song?page=${pageNum}&limit=5`, {
                withCredentials: true,
            });
            setData((prev) => [...prev, ...res.data.data]);
            setHasMore(res.data.hasMore);
        } catch (err) {
            console.log(err);
        }
    };
    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
        fetchApi(page + 1);
    };
    useEffect(() => {
        const fetchApi = async () => {
            const res = await api.get('auth/me', { withCredentials: true });
            setUser(res.data.user);
        };
        fetchApi();
    }, []);

    return (
        <Playlist
            hasMore={hasMore}
            loadMore={loadMore}
            dataSongs={data}
            text={user.username}
            spanTextHead={'Hồ sơ'}
            imageCircle={user.avatar}
        />
    );
}

export default Profile;
