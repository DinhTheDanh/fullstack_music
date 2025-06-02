import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import tinycolor from 'tinycolor2';
import { FastAverageColor } from 'fast-average-color';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './Playlist.module.scss';
import Image from '~/components/Image';
import { PauseIcon, PlayIcon } from '~/components/Icon';
import SongLists from '~/components/SongLists';
import api from '~/ultis/httpsRequest';
import { UpdateDataSidebarContext } from '~/context/UpdateDataSidebarProvider';

const cx = classNames.bind(style);
function Playlist({ dataArtist, dataSongs, imageSquare, imageCircle, text, loadMore, hasMore, spanTextHead }) {
    const { dataFollow, setDataFollow } = useContext(UpdateDataSidebarContext);

    const location = useLocation();

    // Lấy state từ redux data music
    const { isPlaying } = useSelector((state) => state.player);

    const [dominantColor, setDominantColor] = useState(null);
    const [isDark, setIsDark] = useState(false);
    const [hasFollow, setHasFollow] = useState([]);
    const [isFollow, setIsFollow] = useState(false);
    const [isChangeForm, setIsChangeForm] = useState(false);
    const [name, setName] = useState(text);
    const [url, setUrl] = useState(imageCircle);

    const headerControlRef = useRef();

    const baseColor = tinycolor(dominantColor);
    const lightColor = baseColor.saturate(10).toHexString();
    const darkerColor = baseColor.desaturate(30).darken(35).toHexString();

    useEffect(() => {
        if (text !== undefined) {
            setName(text);
        }
    }, [text, isChangeForm]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await api.get('auth/follow', {
                    withCredentials: true,
                });
                setHasFollow(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchApi();
    }, [dataFollow.length]);
    useEffect(() => {
        if (dataArtist && hasFollow) {
            const isFollowing = hasFollow.some((fl) => fl._id === dataArtist._id);
            setIsFollow(isFollowing);
        }
    }, [dataArtist]);

    useEffect(() => {
        imageCircle = url;
    }, [url]);

    useEffect(() => {
        const headerControl = headerControlRef.current;
        window.onscroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 200) {
                headerControl.style.display = 'flex';
            } else {
                headerControl.style.display = 'none';
            }
        };
        return () => {
            window.onscroll = null;
        };
    }, []);

    useEffect(() => {
        const fac = new FastAverageColor();
        fac.getColorAsync(imageCircle || imageSquare || dataArtist?.imageProfileArtist)
            .then((color) => {
                if (color.isDark) {
                    setIsDark(true);
                }
                setDominantColor(color.hex); // Lấy màu chủ đạo
            })
            .catch((error) => {
                // console.error('Lỗi khi lấy màu:', error);
            });
    }, [dataArtist, imageCircle]);

    const handleUnfollow = async () => {
        try {
            const res = await api.delete(`auth/delete-follow/${dataArtist._id}`, {
                withCredentials: true,
            });
            if (res.status === 200) {
                setDataFollow((prevs) =>
                    prevs.filter((prev) => prev._id.toString() !== res.data.followDelete._id.toString()),
                );
                setIsFollow(false);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleFollow = async () => {
        try {
            const res = await api.post(
                `auth/add-follow`,
                {
                    artist: dataArtist,
                },
                {
                    withCredentials: true,
                },
            );
            if (res.status === 200) {
                setDataFollow((prev) => [...prev, dataArtist]);
                setIsFollow(true);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
                'auth/update-user',
                {
                    name,
                    url,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div
                ref={headerControlRef}
                style={{ '--color-background': `${!isDark ? darkerColor : lightColor}` }}
                className={cx('header-control', 'd-none d-md-none')}
            >
                <div className={cx('background-icon')}>{isPlaying ? <PlayIcon /> : <PauseIcon />}</div>
                <span className={cx('text-control')}>{dataArtist?.name || text}</span>
            </div>
            <header className={cx('head')}>
                <div className={cx('position-relative')} style={{ '--color-background': `${lightColor}` }}>
                    <img className={cx('image-playlist')}></img>
                    <div className={cx('head-content')}>
                        <Image
                            border={imageCircle}
                            src={imageSquare || imageCircle || dataArtist?.imageProfileArtist}
                            className={cx(imageSquare || imageCircle ? 'image-head-content_left' : 'image-head')}
                        />

                        {location.pathname !== '/profile' || (
                            <span className={cx('head-change_profile')} onClick={() => setIsChangeForm(true)}>
                                Chỉnh sửa hồ sơ
                                <FontAwesomeIcon icon={faPen} />
                            </span>
                        )}

                        <div className={cx('head-content_right', 'd-none d-md-block')}>
                            {!spanTextHead ? (
                                <span className={cx('text-head')}>{dataArtist?.name}</span>
                            ) : (
                                <span className={cx('head-content_span')}>{spanTextHead}</span>
                            )}
                            <h1 className={cx('head-content_text', { activeText: text })}>{text}</h1>
                        </div>
                    </div>
                </div>
            </header>
            <div className={cx('container')}>
                <div
                    style={{ '--color-background': `${!isDark ? darkerColor : lightColor}` }}
                    className={cx('container-top')}
                >
                    <div className={cx('container-top-control')}>
                        <div className={cx('background-icon')}>{isPlaying ? <PlayIcon /> : <PauseIcon />}</div>
                        {!text &&
                            (!isFollow ? (
                                <span className={cx('following')} onClick={handleFollow}>
                                    Theo dõi
                                </span>
                            ) : (
                                <div className={cx('following')} onClick={handleUnfollow}>
                                    Bỏ theo dõi
                                </div>
                            ))}
                    </div>
                    {!!text || <span className={cx('container-top_text')}>Phổ biển</span>}
                </div>

                <SongLists data={dataSongs} />
                {hasMore && (
                    <button className={cx('button-add')} onClick={loadMore}>
                        Xem thêm
                    </button>
                )}
            </div>
            {isChangeForm ? (
                <div className={cx('change_profile-wrap')}>
                    <div className={cx('change_profile-container')}>
                        <header className={cx('change_profile-head')}>
                            <span className={cx('change_profile-text')}>Chi tiết hồ sơ</span>
                            <span className={cx('change_profile-icon')} onClick={() => setIsChangeForm(false)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </span>
                        </header>
                        <div className={cx('change_profile-content')}>
                            <label htmlFor="fileUpload" className={cx('upload-label')}>
                                <Image
                                    border={imageCircle}
                                    src={imageCircle}
                                    className={cx('image-head-content_left')}
                                />
                            </label>
                            <input
                                id="fileUpload"
                                type="file"
                                accept="image/*"
                                className={cx('input-file')}
                                onChange={(e) => setUrl(e.target.files[0])}
                            />

                            <form onSubmit={handleSubmit} className={cx('change_profile-form')}>
                                <input
                                    className={cx('change_profile-input')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    onClick={() =>
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 3000)
                                    }
                                    className={cx('change_profile-btn')}
                                >
                                    Lưu
                                </button>
                            </form>
                        </div>
                        <div className={cx('change_profile-footer')}>
                            Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh bạn đã chọn để tải
                            lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh.
                        </div>
                    </div>
                </div>
            ) : (
                <span></span>
            )}
        </div>
    );
}

export default Playlist;
