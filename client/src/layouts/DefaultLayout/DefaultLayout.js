import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import FooterContent from '../components/FooterContent';
import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppProvider';
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const sidebarRef = useRef();
    const resizerRef = useRef();
    const refLibaratyText = useRef();
    const refPlus = useRef();
    const refSearch = useRef();
    const refFooter = useRef();
    const refArtistText = useRef([]);
    const refSongTextLike = useRef();
    const refContainer = useRef();
    const { user } = useContext(AppContext);

    useEffect(() => {
        const sidebar = sidebarRef.current;
        const resizer = resizerRef.current;
        const libaratyText = refLibaratyText.current;
        const search = refSearch.current;
        const footer = refFooter.current;

        const container = refContainer.current;
        if (window.innerWidth < 768 && !!user) {
            container.style.margin = '0';
        }

        let isResizing = false;
        resizer.addEventListener('mousedown', function (e) {
            isResizing = true;
            document.body.style.cursor = 'ew-resize';
        });

        document.addEventListener('mousemove', function (e) {
            const plus = refPlus.current;
            const songTextLike = refSongTextLike.current;

            if (!isResizing) return;
            const newWidth = e.clientX;
            if (newWidth >= 288 && newWidth <= 500) {
                sidebar.style.width = `${newWidth}px`;
            } else if (newWidth <= 200) {
                sidebar.style.cssText = `
                    width: 72px;
                    padding: 0;
                    display: flex !important;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 20px;
                    `;
                libaratyText.style.display = 'none';
                plus.style.display = 'none';
                search.style.display = 'none';
                if (footer) footer.style.display = 'none';
                refArtistText.current.forEach((ref) => (ref.style.display = 'none'));

                if (songTextLike) {
                    songTextLike.style.display = 'none';
                }
            } else if (newWidth > 72 && newWidth <= 288) {
                sidebar.style.cssText = `
                    width: 288px;
                    padding: 12px 14px;
                    `;

                libaratyText.style.display = 'block';
                plus.style.display = 'flex';
                search.style.display = 'flex';
                if (footer) footer.style.display = 'block';
                refArtistText.current.forEach((ref) => (ref.style.display = 'block'));
                if (songTextLike) {
                    songTextLike.style.display = 'block';
                }
            }
        });

        document.addEventListener('mouseup', function (e) {
            isResizing = false;
            document.body.style.cursor = 'default';
        });
    }, []);
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div ref={refContainer} className={cx('container')}>
                <Sidebar
                    refArtistText={refArtistText}
                    refSongTextLike={refSongTextLike}
                    refFooter={refFooter}
                    refLibaratyText={refLibaratyText}
                    refPlus={refPlus}
                    refSearch={refSearch}
                    ref={sidebarRef}
                />
                <div ref={resizerRef} className={cx('resizer')}></div>
                <div className={cx('content')}>
                    {children}
                    <FooterContent />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
