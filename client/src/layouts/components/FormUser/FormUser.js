import Tippy from '@tippyjs/react';
// import 'tippy.js/dist/tippy.css';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import style from './FormUser.module.scss';
import { AccessIcon } from '~/components/Icon';
import Image from '~/components/Image';
import { useContext, useState } from 'react';
import config from '~/config/config';
import { Link } from 'react-router-dom';
import api from '~/ultis/httpsRequest';
import { AppContext } from '~/context/AppProvider';
const cx = classNames.bind(style);
const menuItem = [
    {
        label: 'Hồ sơ',
        href: config.routes.profile,
    },
    {
        label: 'Cài đặt',
    },
    {
        label: 'More',
        role: 'admin',
        children: [
            {
                label: 'Thêm người sáng tác',
                href: config.routes.createArtist,
            },
            {
                label: 'Xem tất cả người sáng tác',
                href: config.routes.adminShowArtist,
            },
        ],
    },
];

function FormUser({ user }) {
    const [isHidden, setIsHidden] = useState(false);
    const [menuItems, setMenuItems] = useState(menuItem);
    const { setUser } = useContext(AppContext);

    const roleAdmin = user.role === 'admin';

    const handleLogOut = () => {
        const fetchApi = async () => {
            try {
                const res = await api.get('auth/logout', {
                    withCredentials: 'include',
                });
                window.location.href = '/';
                localStorage.clear();
            } catch (err) {
                console.log(err);
            }
        };
        localStorage.removeItem('user');
        setUser('');
        fetchApi();
    };
    const handleClickItem = (item) => {
        if (item.children) {
            setMenuItems(item.children);
        }
    };
    const renderNavUserForm = (attrs) => (
        <div {...attrs} tabIndex="-1" className={cx('nav-user-form')}>
            <div className={cx('text-nav-user-form')}>
                Tài khoản
                <AccessIcon />
            </div>
            {menuItems.map((item, index) => {
                return (
                    <Link
                        to={item.href}
                        key={index}
                        className={cx('text-nav-user-form', { hiddenitem: item.role && !roleAdmin })}
                    >
                        <div onClick={() => handleClickItem(item)} key={index}>
                            {item.label}
                        </div>
                    </Link>
                );
            })}
            <div onClick={handleLogOut} className={cx('text-nav-user-form')}>
                Đăng xuất
            </div>
        </div>
    );
    return (
        <div className={cx('user-form')}>
            <HeadlessTippy
                onClickOutside={() => setIsHidden(false)}
                placement="bottom"
                visible={isHidden}
                interactive
                render={(attrs) => renderNavUserForm(attrs)}
            >
                <div>
                    <Tippy delay={[500, 300]} interactive placement="bottom" content={user.username}>
                        <div
                            onClick={() => {
                                if (!isHidden) {
                                    setIsHidden(true);
                                    setMenuItems(menuItem);
                                } else {
                                    setIsHidden(false);
                                }
                            }}
                            className={cx('user-background')}
                        >
                            <Image src={user?.avatar} border />
                        </div>
                    </Tippy>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default FormUser;
