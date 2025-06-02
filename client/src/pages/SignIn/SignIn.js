import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import api from '~/ultis/httpsRequest';
import style from './SignIn.module.scss';
import Image from '~/components/Image';
import img from '~/assets/images/rounded-in-photoretrica.png';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { loginSchema } from '~/validations/authSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import config from '~/config/config';

const cx = classNames.bind(style);

function SignIn() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onBlur',
    });

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:3000/auth/facebook';
    };

    const onSubmit = async (data) => {
        try {
            const response = await api.post('auth/login', data, {
                withCredentials: true,
            });
            navigate('/');
        } catch (error) {
            setMessage(error.response.data.message);
            console.error('Lỗi đăng nhập:', error.response.data.message);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <Link to={config.routes.home} className={cx('header')}>
                    <Image src={img} border small />
                    <span className={cx('header-text')}>Đăng nhập vào Spotify</span>
                </Link>
                {!!message && (
                    <div className={cx('errors-res')}>
                        <FontAwesomeIcon
                            style={{ marginRight: 4, fontSize: 16 }}
                            className={cx('icon-error')}
                            icon={faCircleExclamation}
                        />
                        {message}
                    </div>
                )}

                <div className={cx('content-media')}>
                    <button onClick={handleGoogleLogin} className={cx('button-media')}>
                        <Image
                            src="https://accounts.scdn.co/sso/images/new-google-icon.72fd940a229bc94cf9484a3320b3dccb.svg"
                            style={{ width: 24, height: 24, marginRight: 20, position: 'absolute', left: 65 }}
                        />
                        Tiếp tục bằng Google
                    </button>
                    <button onClick={handleFacebookLogin} className={cx('button-media')}>
                        <Image
                            src="https://accounts.scdn.co/sso/images/new-facebook-icon.eae8e1b6256f7ccf01cf81913254e70b.svg"
                            style={{ width: 24, height: 24, marginRight: 20, position: 'absolute', left: 65 }}
                        />
                        Tiếp tục bằng Facebook
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={cx('form')}>
                    <label htmlFor="email">Nhập email</label>
                    <input {...register('email')} className={cx('input')} type="email" id="email" placeholder="Email" />
                    {errors.email && (
                        <p className={cx('errors-text')}>
                            <FontAwesomeIcon
                                style={{ marginRight: 4 }}
                                className={cx('icon-error')}
                                icon={faCircleExclamation}
                            />
                            {errors.email?.message}
                        </p>
                    )}

                    <label htmlFor="password">Nhập mật khẩu</label>
                    <input
                        {...register('password')}
                        type="password"
                        className={cx('input')}
                        id="password"
                        placeholder="Password"
                    />
                    {errors.password && (
                        <p className={cx('errors-text')}>
                            <FontAwesomeIcon style={{ marginRight: 4 }} icon={faCircleExclamation} />
                            {errors.password?.message}
                        </p>
                    )}

                    <button className={cx('button-form')} type="submit">
                        Đăng nhập
                    </button>
                    <Link
                        to={config.routes.forgotPassword}
                        className={cx('text-bottom', 'd-flex justify-content-center mt-5')}
                    >
                        Quên mật khẩu của bạn?
                    </Link>
                    <div className={cx('footer')}>
                        Bạn chưa có tài khoản?
                        <Link style={{ marginLeft: 6 }} className={cx('text-bottom')} to={config.routes.signup}>
                            Đăng ký
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
