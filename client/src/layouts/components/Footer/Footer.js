import { faHeart, faPlus, faVolumeDown, faVolumeUp, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useRef, useState } from 'react';

import { NextIcon, PauseIcon, PlayIcon, PreviousIcon, RepeatIcon, ShuffleIcon } from '~/components/Icon';
import Image from '~/components/Image';
import style from './Footer.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaying, setIdSong, pauseSong } from '~/redux/playerSlice';

const cx = classNames.bind(style);

function Footer() {
    // const [dominantColor, setDominantColor] = useState(null);
    // const [isDark, setIsDark] = useState(false);

    // useEffect(() => {
    //     const fac = new FastAverageColor();
    //     fac.getColorAsync(imageCircle || imageSquare || dataArtist?.imageProfileArtist)
    //         .then((color) => {
    //             if (color.isDark) {
    //                 setIsDark(true);
    //             }
    //             setDominantColor(color.hex); // Lấy màu chủ đạo
    //         })
    //         .catch((error) => {
    //             // console.error('Lỗi khi lấy màu:', error);
    //         });
    // }, [dataArtist, imageCircle]);

    // const baseColor = tinycolor(dominantColor);
    // const lightColor = baseColor.saturate(10).toHexString();
    // const darkerColor = baseColor.desaturate(30).darken(35).toHexString();

    const controllerStorage = JSON.parse(localStorage.getItem('controller')) ?? false;
    const volumeStorage = localStorage.getItem('volume');
    // Lấy state từ redux data music
    const dispatch = useDispatch();
    const { isPlaying, currentSongId, currentSongData } = useSelector((state) => state.player);
    // Tạo State
    const [data, setData] = useState(currentSongData?.[currentSongId] ?? []);
    const [currentIndex, setCurrentIndex] = useState(currentSongId);
    const [shuffle, setShuffle] = useState(controllerStorage?.shuffle || false);
    const [repeat, setRepeat] = useState(controllerStorage?.repeat || false);
    const [volume, setVolume] = useState(volumeStorage || 0);
    const [textDesc, setTextDesc] = useState([]);
    // Tạo Ref
    const audioRef = useRef();
    const inputProcessBarRef = useRef();
    const inputProcessBackgroundRef = useRef();
    const timeCurrentRef = useRef();
    const timeDurationRef = useRef();
    const nextIconRef = useRef();
    const prevIconRef = useRef();
    const inputVolumeControlRef = useRef();
    const inputVolumeControlBackGroundRef = useRef();
    const inputProcessBarMobileRef = useRef();
    const inputProcessBackgroundMobileRef = useRef();

    // Hàm xử lý volume
    const renderIconVolumes = useCallback(() => {
        if (volume > 0.5) {
            return <FontAwesomeIcon icon={faVolumeUp} />;
        } else if (volume > 0 && volume <= 0.5) {
            return <FontAwesomeIcon icon={faVolumeDown} />;
        } else {
            return <FontAwesomeIcon icon={faVolumeXmark} />;
        }
    }, [volume]);

    // Xử lý audio khi phát
    useEffect(() => {
        //Current state
        const audio = audioRef.current;
        const inputProcessBar = inputProcessBarRef.current;
        const inputProcessBarMobile = inputProcessBarMobileRef.current;
        const inputProcessBackground = inputProcessBackgroundRef.current;
        const inputProcessBackgroundMobile = inputProcessBackgroundMobileRef.current;
        const timeCurrent = timeCurrentRef.current;
        const timeDuration = timeDurationRef.current;
        const nextIcon = nextIconRef.current;
        const prevIcon = prevIconRef.current;
        const inputVolumeControl = inputVolumeControlRef.current;
        const inputVolumeControlBackGround = inputVolumeControlBackGroundRef.current;

        const duration = audio.duration;

        localStorage.setItem('controller', JSON.stringify({ shuffle: shuffle, repeat: repeat }));

        const app = {
            //Hàm cập nhật current
            loadTimeCurrent: function () {
                const currentTime = audio.currentTime;
                const minuteCurrentTime = Math.floor(currentTime / 60);
                const secondsCurrentTime = Math.floor(currentTime % 60);
                //Tạo currentTime time
                if (Math.floor(currentTime % 60 < 10)) {
                    timeCurrent.innerText = `${minuteCurrentTime}:0${secondsCurrentTime}`;
                } else {
                    timeCurrent.innerText = `${minuteCurrentTime}:${secondsCurrentTime}`;
                }
            },
            // Hàm cập nhật duration
            loadTimeDuration: function () {
                if (!isFinite(duration)) {
                    timeDuration.innerText = `0:00`;
                    return;
                }

                const minuteDuration = duration / 60;
                const secondsDuration = Math.floor(duration % 60);

                if (secondsDuration < 10) {
                    timeDuration.innerText = `${Math.floor(minuteDuration)}:0${secondsDuration}`;
                } else {
                    timeDuration.innerText = `${Math.floor(minuteDuration)}:${secondsDuration}`;
                }
            },

            // Hàm khi next song
            nextSong: function () {
                if (currentIndex < currentSongData.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                    setData(currentSongData[currentIndex + 1]);
                    dispatch(setIdSong(currentIndex));
                } else {
                    setCurrentIndex(0);
                    setData(currentSongData[0]);
                }
            },
            // Hàm khi prev song
            prevSong: function () {
                if (currentIndex > 0) {
                    setCurrentIndex((prev) => prev - 1);
                    setData(currentSongData[currentIndex - 1]);
                } else {
                    setCurrentIndex(currentSongData.length - 1);
                    setData(currentSongData[currentSongData.length - 1]);
                }
            },
            // Hàm shuffle song
            randomSong: function () {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * currentSongData.length);
                } while (newIndex === currentIndex);
                setCurrentIndex(newIndex);
                setData(currentSongData[currentIndex]);
            },
            // Hàm set time out
            setTimeDelay: function () {
                dispatch(pauseSong());

                const handleCanPlay = () => {
                    dispatch(setPlaying());
                    audio.play().catch((err) => {
                        console.warn('Play interrupted', err);
                    });
                    audio.removeEventListener('canplay', handleCanPlay); // Gỡ sau khi dùng xong
                };

                audio.removeEventListener('canplay', handleCanPlay); // Gỡ trước (đề phòng bị gắn nhiều lần)
                audio.addEventListener('canplay', handleCanPlay); // Gắn lại
            },
            // Hàm set volume
            volumeSong: function () {
                inputVolumeControlBackGround.style.width = `${volume * 100}%`;
                audio.volume = volume;
                inputVolumeControl.oninput = function (e) {
                    audio.volume = e.target.value;
                    inputVolumeControlBackGround.style.width = `${audio.volume * 100}%`;
                    localStorage.setItem('volume', audio.volume);
                    setVolume(audio.volume);
                };
            },

            // Hàm xử lý event
            handleEvents: function () {
                const _this = this;
                if (audio) {
                    if (isPlaying) {
                        audio.play();
                        audio.ontimeupdate = function () {
                            const currentTime = audio.currentTime;
                            const processTime = (currentTime / duration) * 100;
                            inputProcessBackground.style.width = `${processTime}%`;
                            inputProcessBackgroundMobile.style.width = `${processTime}%`;
                            inputProcessBar.value = `${processTime}`;
                            inputProcessBarMobile.value = `${processTime}`;
                            _this.loadTimeCurrent();
                        };
                        audio.onended = function () {
                            if (repeat) {
                                audio.loop = true;
                                audio.play();
                            } else {
                                audio.loop = false;
                                if (shuffle) {
                                    _this.randomSong();
                                    _this.setTimeDelay();
                                } else {
                                    _this.nextSong();
                                    _this.setTimeDelay();
                                }
                            }
                        };
                        inputProcessBar.oninput = function (e) {
                            if (!isFinite(duration) || duration === 0) return;
                            const newTime = (e.target.value / 100) * duration;
                            if (!isNaN(newTime) && isFinite(newTime)) audio.currentTime = newTime;
                        };
                        inputProcessBarMobile.oninput = function (e) {
                            if (!isFinite(duration) || duration === 0) return;
                            const newTime = (e.target.value / 100) * duration;
                            if (!isNaN(newTime) && isFinite(newTime)) audio.currentTime = newTime;
                        };
                        nextIcon.onclick = () => {
                            if (shuffle) {
                                _this.randomSong();
                                _this.setTimeDelay();
                            } else {
                                _this.nextSong();
                                _this.setTimeDelay();
                            }
                        };
                        prevIcon.onclick = () => {
                            if (shuffle) {
                                _this.randomSong();
                                _this.setTimeDelay();
                            } else {
                                _this.prevSong();
                                _this.setTimeDelay();
                            }
                        };
                    } else {
                        audio.pause();
                    }
                }
            },
            start: function () {
                this.handleEvents();
                this.loadTimeDuration();
                this.volumeSong();
            },
        };
        app.start();
        return () => {
            audio.ontimeupdate = null;
            audio.onended = null;
            inputProcessBar.oninput = null;
            inputProcessBarMobile.oninput = null;
            nextIcon.onclick = null;
            prevIcon.onclick = null;
            inputVolumeControl.oninput = null;
        };
    }, [isPlaying, currentSongId]);

    //Xử lý khi thêm state ở context
    useEffect(() => {
        setData(currentSongData?.[currentSongId]);
        setCurrentIndex(currentSongId);
        setVolume(volumeStorage);
    }, [currentSongId, currentSongData]);

    useEffect(() => {
        let texts;
        if (data?.composer?.includes(' ')) {
            texts = data?.composer?.split(', ');
        } else {
            texts = data?.composer?.split(',');
        }
        setTextDesc(texts);
    }, [data]);

    return (
        <div className={cx('footer', { noAllow: !data })}>
            <div className={cx('wrapper')}>
                <div className={cx('left-content')}>
                    <Image src={data?.imageSong} className={cx('img')} />
                    <div className={cx('track-details')}>
                        <div className={cx('text-head')}>{data?.name}</div>
                        <div className={cx('text-wrap-name')}>
                            {textDesc?.map((text, index) => (
                                // <Link key={index} to={`/artist/${text}`}>
                                <div key={index} className={cx('text-desc')}>
                                    {text}
                                    {index < textDesc?.length - 1 && ', '}
                                </div>
                                // </Link>
                            ))}
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faPlus} className={cx('icon-plus', 'd-none d-md-flex')} />
                </div>
                <div className="d-md-none d-flex align-items-center">
                    {isPlaying ? (
                        <i
                            onClick={() => {
                                dispatch(pauseSong());
                            }}
                        >
                            <PlayIcon className={cx('icon-control-mobile')} />
                        </i>
                    ) : (
                        <i
                            onClick={() => {
                                dispatch(setPlaying());
                            }}
                        >
                            <PauseIcon className={cx('icon-control-mobile')} />
                        </i>
                    )}
                </div>
                <div className={cx('process-bar_mobile', 'd-md-none')}>
                    <div className={cx('form-process-bar_mobile')}>
                        <input
                            ref={inputProcessBarMobileRef}
                            className={cx('input-process-bar')}
                            type="range"
                            min="0"
                            step="0.1"
                            max="100"
                        />
                        <nav ref={inputProcessBackgroundMobileRef} className={cx('input-process-bar_background')}></nav>
                    </div>
                </div>
                <div className={cx('player-container', 'd-none d-md-flex')}>
                    <div className={cx('control-bar')}>
                        <ShuffleIcon
                            onClick={() => {
                                setShuffle(!shuffle);
                            }}
                            className={cx('icon-control-bar', { active: shuffle })}
                        />
                        <PreviousIcon ref={prevIconRef} className={cx('icon-control-bar')} />
                        {isPlaying ? (
                            <i
                                onClick={() => {
                                    dispatch(pauseSong());
                                }}
                                className={cx('icon-control-bar__background')}
                            >
                                <PlayIcon className={cx('icon-control-bar__active')} />
                            </i>
                        ) : (
                            <i
                                onClick={() => {
                                    dispatch(setPlaying());
                                }}
                                className={cx('icon-control-bar__background')}
                            >
                                <PauseIcon className={cx('icon-control-bar__active')} />
                            </i>
                        )}

                        <NextIcon ref={nextIconRef} className={cx('icon-control-bar')} />
                        <RepeatIcon
                            onClick={() => {
                                setRepeat(!repeat);
                            }}
                            className={cx('icon-control-bar', { active: repeat })}
                        />
                    </div>
                    <div className={cx('process-bar')}>
                        <span ref={timeCurrentRef} className={cx('time')}>
                            0:00
                        </span>
                        <div className={cx('form-process-bar')}>
                            <input
                                ref={inputProcessBarRef}
                                className={cx('input-process-bar')}
                                type="range"
                                min="0"
                                step="0.1"
                                max="100"
                            />
                            <nav ref={inputProcessBackgroundRef} className={cx('input-process-bar_background')}></nav>
                        </div>
                        <span ref={timeDurationRef} className={cx('time')}>
                            0:00
                        </span>
                    </div>
                </div>
                <div className={cx('wrapper-volume', 'd-none d-md-flex')}>
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {renderIconVolumes()}
                    </div>
                    <div className={cx('volume-control')}>
                        <input
                            ref={inputVolumeControlRef}
                            defaultValue={volume}
                            className={cx('input-volume-control')}
                            type="range"
                            min="0"
                            step="0.1"
                            max="1"
                        />
                        <nav
                            ref={inputVolumeControlBackGroundRef}
                            className={cx('input-volume-control_background')}
                        ></nav>
                    </div>
                </div>
            </div>
            <audio ref={audioRef} src={data?.url} type="audio/mp3" />
        </div>
    );
}

export default Footer;
