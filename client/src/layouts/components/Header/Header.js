import classNames from 'classnames/bind';

import { HomeActiveIcon, HomeIcon, SearchIcon } from '~/components/Icon';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import MenuItem from '~/components/MenuItem';
import config from '~/config/config';
import styles from './Header.module.scss';
import img from '~/assets/images/rounded-in-photoretrica.png';
import api from '~/ultis/httpsRequest';

import FormUser from '../FormUser';
import Search from '../Search';
import { AppContext } from '~/context/AppProvider';
const cx = classNames.bind(styles);
function Header() {
    const [data, setData] = useState();
    const { setUser } = useContext(AppContext);
    const refHead = useRef();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const resApi = await api.get('auth/me', {
                    withCredentials: 'include', // Gửi cookie session
                });
                setData(resApi.data.user);
                setUser(resApi.data.user.role);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);
    useEffect(() => {
        const header = refHead.current;
        if (window.innerWidth < 768 && !!data) {
            header.style.display = 'none';
        }
    }, [data]);

    return (
        <div ref={refHead} className={cx('wrapper', 'container-fluid')}>
            <div className={cx('row', 'wrapper')}>
                <Link className={cx('col-1 col-lg-2  col-md-3 col-sm-1')} to={config.routes.home}>
                    <img className={cx('logo')} src={img}></img>
                </Link>

                <div className={cx('search-home', 'col-7 col-lg-6 col-md-5 col-sm-6 ')}>
                    <Tippy delay={[500, 300]} content="Home" placement="bottom">
                        <div className={cx('background-icon', 'd-none d-md-block')}>
                            <MenuItem icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} to={config.routes.home} />
                        </div>
                    </Tippy>

                    <Search />
                </div>
                {!data ? (
                    <div className={cx('auth-form', 'col-2 col-lg-3 col-md-4 col-sm-5 d-sm-flex d-none')}>
                        <Link to={config.routes.signup}>
                            <div className={cx('register')}>Đăng ký</div>
                        </Link>
                        <Link to={config.routes.login}>
                            <div className={cx('login')}>Đăng nhập</div>
                        </Link>
                    </div>
                ) : (
                    <FormUser user={data} />
                )}
            </div>
        </div>
    );
}

export default Header;
