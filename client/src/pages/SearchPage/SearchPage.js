import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import Image from '~/components/Image';
import SongLists from '~/components/SongLists';
import api from '~/ultis/httpsRequest';

import style from './SearchPage.module.scss';

const cx = classNames.bind(style);
function SearchPage() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');
    const [dataArtist, setDataArtist] = useState([]);
    const [dataSongs, setDataSongs] = useState([]);
    const [textDesc, setTextDesc] = useState([]);

    const navigate = useNavigate();

    let data;

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await api.get(`search?q=${query}&limit=${3}`);
                setDataArtist(res?.data?.dataArtist);
                setDataSongs(res?.data?.dataSongs);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [query]);

    useEffect(() => {
        let texts;
        if (dataSongs[0]?.composer?.includes(' ')) {
            texts = dataSongs[0]?.composer?.split(', ');
        } else {
            texts = dataSongs[0]?.composer?.split(',');
        }
        setTextDesc(texts);
    }, [dataArtist]);

    if (dataSongs.length <= 0) {
        data = dataArtist;
    } else {
        data = dataSongs;
    }
    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <span className={cx('text-header', { active: true })}>Tất cả</span>
                <span className={cx('text-header')}>Bài hát</span>
                <span className={cx('text-header')}>Nghệ sĩ</span>
                <span className={cx('text-header')}>Hồ sơ</span>
            </header>
            <div className={cx('container')}>
                <div className={cx('result-track')}>
                    <div className={cx('container-text-head')}>Kết quả hàng đầu </div>
                    <Link to={`/artist/${data[0]?._id}` ?? query}>
                        <div className={cx('result-track_item')}>
                            {data[0] !== dataArtist[0] ? (
                                <Image src={data[0]?.imageSong} large />
                            ) : (
                                <Image src={data[0]?.imageArtist} large />
                            )}
                            <div className={cx('result-track_name_song')}>{data[0]?.name ?? query}</div>
                            <div className={cx('result-track_artist_wrap')}>
                                {!!textDesc ? (
                                    <div className={cx('d-flex justify-content-center align-items-center')}>
                                        <span className={cx('result-track_span')}>Bài hát</span>
                                        <div className={cx('result-track_artist_song')}>
                                            {textDesc.map((text, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => navigate(`/artist/${text}`)}
                                                    className={cx('text-desc')}
                                                >
                                                    {text}
                                                    {index < textDesc?.length - 1 && ', '}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={cx('result-track_span')}>{data[0]?.role}</div>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
                <div className={cx('list-song')}>
                    <div className={cx('container-text-head')}>Bài hát</div>
                    <SongLists data={data} />
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
