import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Image from '~/components/Image';
import config from '~/config/config';
import { UpdateDataSidebarContext } from '~/context/UpdateDataSidebarProvider';
import api from '~/ultis/httpsRequest';
import { AccessIcon } from '../Icon';
import style from './UserSongItem.module.scss';
const cx = classNames.bind(style);

function UserSongItem({ data, refSong, refArtist, refSongTextLike, refArtistText }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [activeMenu, setActiveMenu] = useState(null);
    const { setDataFollow } = useContext(UpdateDataSidebarContext);

    const handleDeleteFollow = async (id) => {
        try {
            const res = await api.delete(`auth/delete-follow/${id}`, {
                withCredentials: true,
            });
            setDataFollow((prevs) =>
                prevs.filter((prev) => prev._id.toString() !== res.data.followDelete._id.toString()),
            );
        } catch (err) {
            console.log(err);
        }
    };

    const renderOptions = (attrs, id) => (
        <div className={cx('context-menu')} tabIndex="-1" {...attrs}>
            <span className={cx('menu-item')}>
                <FontAwesomeIcon
                    onClick={() => handleDeleteFollow(id)}
                    className={cx('background-icon')}
                    icon={faCheck}
                />
                Loại bỏ khỏi hồ sơ yêu thích
            </span>
            <span className={cx('menu-item')}>
                <AccessIcon className={cx('icon')} />
                Chia sẻ
            </span>
        </div>
    );
    const handleContextMenu = (event, artistID) => {
        event.preventDefault(); // Chặn menu mặc định của trình duyệt
        setPosition({ x: event.clientX, y: event.clientY });
        setActiveMenu(artistID);
    };
    return (
        <div>
            {!data[0]?.role ? (
                <NavLink
                    style={{ border: '2px solid transparent' }}
                    ref={refSong}
                    to={config.routes.collectionTrack}
                    className={(nav) => cx('content-item', { active: nav.isActive })}
                >
                    <Image small src={'https://misc.scdn.co/liked-songs/liked-songs-64.png'} />
                    <div ref={refSongTextLike} className={cx('content-head')}>
                        <div className={cx('content-text', { active: true })}>Bài hát đã thích</div>
                        <div className={cx('content-desc')}>
                            Danh sách phát
                            <div className={cx('content-span')}>{data.length} bài hát</div>
                        </div>
                    </div>
                </NavLink>
            ) : (
                <div ref={refArtist} style={{ border: '2px solid transparent' }}>
                    {data?.map((artist, index) => {
                        return (
                            <HeadlessTippy
                                key={index}
                                onClickOutside={() => setActiveMenu(null)}
                                placement="right"
                                // offset={[position.x, -position.y]}
                                visible={activeMenu === artist._id}
                                interactive
                                render={(attrs) => renderOptions(attrs, artist?._id)}
                                appendTo={document.body}
                            >
                                <NavLink
                                    onContextMenu={(e) => handleContextMenu(e, artist._id)}
                                    to={`/artist/${artist._id}`}
                                    className={(nav) => cx('content-item', { active: nav.isActive })}
                                >
                                    <Image border small src={artist?.imageArtist} />
                                    <div
                                        ref={(el) => (refArtistText.current[index] = el)}
                                        className={cx('content-head')}
                                    >
                                        <div className={cx('content-text')}>{artist?.name}</div>
                                        <div className={cx('content-desc')}>{artist?.role}</div>
                                    </div>
                                </NavLink>
                            </HeadlessTippy>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
export default UserSongItem;
