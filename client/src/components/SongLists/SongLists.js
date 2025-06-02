import { useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import style from './SongLists.module.scss';
import Image from '~/components/Image';
import { AccessIcon, PauseIcon } from '~/components/Icon';
import api from '~/ultis/httpsRequest';
import { UpdateDataSidebarContext } from '~/context/UpdateDataSidebarProvider';
import { useDispatch, useSelector } from 'react-redux';
import { pauseSong, playSong, setPlaying, setIdSong } from '~/redux/playerSlice';
import { TailSpin } from 'react-loader-spinner';

const cx = classNames.bind(style);
function SongLists({ data }) {
    const { setIsHasData, setDataFavoriteSong, dataFavoriteSong } = useContext(UpdateDataSidebarContext);
    const { isPlaying, currentSongId, currentSongData } = useSelector((state) => state.player);

    const [hoverId, setHoverId] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isMatch, setIsMatch] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchApi = async (pageNum) => {
            try {
                const res = await api.get(`auth/favorite-song?page=${pageNum}&limit=5`, {
                    withCredentials: true,
                });
                setDataFavoriteSong(res.data.length);
            } catch (err) {
                console.log(err);
            }
        };
        fetchApi();
    }, [dataFavoriteSong.length]);

    let dataSong;
    if (data?.hasOwnProperty('songs')) {
        dataSong = data?.songs;
    } else if (data == null || data == undefined) {
        data = [];
    } else if (data[0]?.hasOwnProperty('songs')) {
        dataSong = data[0]?.songs;
    } else {
        dataSong = data;
    }

    // Tạo ra Icon của phần element Song
    const containerIcon = useCallback(
        (song, index) => {
            return hoverId !== index ? (
                <div className="d-none d-md-block">
                    {index == currentSongId && currentSongData[currentSongId]?.name == song?.name && isPlaying ? (
                        <div className={cx('music-icon')}>
                            <div className={cx('bar')}></div>
                            <div className={cx('bar')}></div>
                            <div className={cx('bar')}></div>
                            <div className={cx('bar')}></div>
                        </div>
                    ) : (
                        <span
                            className={cx('text-center', {
                                active: index == currentSongId && currentSongData[currentSongId]?.name == song?.name,
                            })}
                        >
                            {index + 1}
                        </span>
                    )}
                </div>
            ) : (
                <div className="d-none d-md-block">
                    <PauseIcon />
                </div>
            );
        },
        [hoverId, isPlaying],
    );

    // Khi mà hover vào element
    const handleMouseEnter = useCallback(
        (index) => {
            setHoverId(index);
        },
        [hoverId],
    );

    // Khi mà hết hover vào element
    const handleMouseLeave = useCallback(() => {
        setHoverId(null);
    }, [hoverId]);

    // Khi mà drag element
    const handleDragStart = useCallback((e, song) => {
        e.dataTransfer.setData('song', JSON.stringify(song));
        e.dataTransfer.effectAllowed = 'copy';

        window.dragData = e.currentTarget;
        // Tạo một span chứa tên
        const dragIcon = document.createElement('span');
        dragIcon.textContent = song.name;
        dragIcon.style.fontSize = '16px';
        dragIcon.style.fontWeight = 'bold';
        dragIcon.style.color = '#fff';
        dragIcon.style.background = '#2a2929';
        dragIcon.style.padding = '4px 14px';
        dragIcon.style.borderRadius = '5px';

        // Thêm vào body nhưng không hiển thị
        document.body.appendChild(dragIcon);

        // Đặt hình ảnh kéo thành tên khối
        e.dataTransfer.setDragImage(dragIcon, 10, 10);
    }, []);

    const handleDeleteFavorite = async (song) => {
        try {
            const res = await api.delete(`auth/delete-favorite-song/${song._id}`, {
                withCredentials: true,
            });
            setIsMatch(false);
            setDataFavoriteSong((prevs) => prevs.filter((prev) => prev !== song._id));
            setIsHasData(true);
        } catch (err) {
            console.log(err);
        }
    };
    const handleFavorite = async (song) => {
        try {
            const res = await api.post(
                `auth/add-favorite-song`,
                {
                    id: song._id,
                },
                {
                    withCredentials: true,
                },
            );
            setIsMatch(true);
            setDataFavoriteSong((prev) => [...prev, song]);
            setIsHasData(true); // Cập nhật UI ngay lập tức
        } catch (err) {
            console.log(err);
        }
    };

    const renderOptions = (attrs, song) => {
        return (
            <div className={cx('context-menu')} tabIndex="-1" {...attrs}>
                {isMatch ? (
                    <div className={cx('menu-item')}>
                        <FontAwesomeIcon
                            onClick={() => handleDeleteFavorite(song)}
                            className={cx('background-icon')}
                            icon={faCheck}
                        />
                        Loại bỏ khỏi hồ sơ yêu thích
                    </div>
                ) : (
                    <div className={cx('menu-item')}>
                        <FontAwesomeIcon
                            onClick={() => handleFavorite(song)}
                            className={cx('background-icon', { active: true })}
                            icon={faPlus}
                        />
                        Thêm vào hồ sơ yêu thích
                    </div>
                )}
                <span className={cx('menu-item')}>
                    <AccessIcon className={cx('icon')} />
                    Chia sẻ
                </span>
            </div>
        );
    };
    const handleContextMenu = (event, id) => {
        event.preventDefault(); // Chặn menu mặc định của trình duyệt
        // setPosition({ x: event.clientX, y: event.clientY });
        setActiveMenu(id);
        if (dataFavoriteSong) {
            setIsMatch(dataFavoriteSong.some((songId) => id === songId));
        }
    };

    return (
        <div className={cx('container-center')}>
            {dataSong?.length >= 0 ? (
                dataSong?.map((song, index) => {
                    return (
                        <HeadlessTippy
                            key={index}
                            onClickOutside={() => setActiveMenu(null)}
                            placement="top"
                            // offset={[position.x, -position.y]}
                            visible={activeMenu === song._id}
                            interactive
                            render={(attrs) => renderOptions(attrs, song)}
                            appendTo={document.body}
                        >
                            <div
                                onContextMenu={(e) => handleContextMenu(e, song._id)}
                                draggable="true"
                                id={song?._id}
                                onDragStart={(e) => handleDragStart(e, song)}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                data-zone="song"
                                key={index}
                                className={cx('center-container_item')}
                            >
                                <div className={cx('song-list')}>{containerIcon(song, index)}</div>

                                <Image src={song?.imageSong} className={cx('image-song')} />
                                <div
                                    className={cx('text-center', {
                                        active:
                                            index == currentSongId &&
                                            currentSongData[currentSongId]?.name == song?.name,
                                    })}
                                    onClick={() => {
                                        if (currentSongId === song._id && isPlaying) {
                                            dispatch(pauseSong());
                                        } else {
                                            dispatch(playSong({ id: index, data: dataSong }));
                                            dispatch(pauseSong());
                                            setTimeout(() => {
                                                dispatch(setPlaying());
                                            }, 1000);
                                        }
                                    }}
                                    key={index}
                                >
                                    {song.name}
                                </div>

                                <div className={cx('track-options', 'd-none d-md-flex')}>
                                    <div className={cx('duration-song')}>{song.duration}</div>
                                    {hoverId === index && (
                                        <FontAwesomeIcon icon={faEllipsis} className={cx('icon-ellipsis')} />
                                    )}
                                </div>
                            </div>
                        </HeadlessTippy>
                    );
                })
            ) : (
                // <TailSpin height="80" width="100%" color="#4fa94d" ariaLabel="circles-loading" visible={true} />
                <div></div>
            )}
        </div>
    );
}

export default SongLists;
