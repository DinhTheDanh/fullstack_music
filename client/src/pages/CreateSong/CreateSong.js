import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CreateSong.module.scss';
import api from '~/ultis/httpsRequest';
const cx = classNames.bind(styles);
function CreateSong() {
    const [name, setName] = useState('');
    const [composer, setComposer] = useState('');
    const [imageSong, setImageSong] = useState('');
    const [url, setUrl] = useState(null);
    const [duration, setDuration] = useState('');
    const [message, setMessage] = useState('');
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                `songs/artist/add-song/${id}`,
                { name, composer, imageSong, duration, url },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            setMessage('Song created successfully!');
            setComposer('');
            setName('');
            setImageSong('');
            setUrl(null);
            setDuration('');
            navigate('/admin/artist/artist-admin-show');
        } catch (error) {
            console.error('Error creating song:', error);
            setMessage('Error creating song');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h1>Create Song</h1>
            <form>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Composer:</label>
                    <input type="text" value={composer} onChange={(e) => setComposer(e.target.value)} required />
                </div>
                <div>
                    <label>Image song:</label>
                    <input type="text" value={imageSong} onChange={(e) => setImageSong(e.target.value)} required />
                </div>
                <div>
                    <label>Url sound:</label>
                    <input type="file" accept="audio/*" onChange={(e) => setUrl(e.target.files[0])} required />
                </div>
                <div>
                    <label>Duration sound:</label>
                    <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                </div>

                <button onClick={handleSubmit} type="submit">
                    Create Song
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateSong;
