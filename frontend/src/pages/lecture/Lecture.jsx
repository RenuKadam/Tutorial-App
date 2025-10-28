import React, { useEffect, useState, useRef } from 'react';
import './lecture.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../main';
import Loading from '../../components/loading/Loading';
import toast from 'react-hot-toast';

const Lecture = ({ user }) => {
    const [lectures, setLectures] = useState([]);
    const [lecture, setLecture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lecLoading, setLecLoading] = useState(false);
    const [show, setShow] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState("");
    const [videoPrev, setVideoPrev] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);

    // Video tracking states
    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    if (user && user.role !== "admin" && !user.subscription.includes(params.id))
        return navigate("/");

    async function fetchLectures() {
        try {
            const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setLectures(data.lectures);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    async function fetchLecture(id) {
        setLecLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/lecture/${id}`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setLecture(data.lecture);
            setLecLoading(false);
            setProgress(0);
            setIsCompleted(false);
        } catch (error) {
            console.log(error);
            setLecLoading(false);
        };
    };

    const changeVideoHandler = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setVideoPrev(reader.result);
            setVideo(file);
        };
    };

    const submitHandler = async (e) => {
        setBtnLoading(true);
        e.preventDefault();
        const myForm = new FormData();

        myForm.append("title", title);
        myForm.append("description", description);
        myForm.append("file", video);

        try {
            const { data } = await axios.post(`${server}/api/course/${params.id}`, myForm, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });

            toast.success(data.message);
            setBtnLoading(false);
            setShow(false);
            fetchLectures();
            setTitle("");
            setDescription("");
            setVideo("");
            setVideoPrev("");
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (confirm(" Are you sure you want to delete this lecture ")) {
            try {
                const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                });

                toast.success(data.message);
                fetchLectures();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    }

    useEffect(() => {
        fetchLectures();
    }, []);

    // Handle resume and progress tracking
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !lecture._id) return;

        // Resume logic
        const resumeKey = `lecture-${lecture._id}-progress`;
        const savedTime = parseFloat(localStorage.getItem(resumeKey));

        const handleLoadedMetadata = () => {
            if (savedTime && savedTime < video.duration - 10) {
                const shouldResume = window.confirm("Resume from where you left off?");
                if (shouldResume) {
                    video.currentTime = savedTime;
                }
            }
        };

        const handleTimeUpdate = () => {
            const currentTime = video.currentTime;
            const duration = video.duration;

            // Save progress every 5 seconds
            if (Math.floor(currentTime) % 5 === 0) {
                localStorage.setItem(resumeKey, currentTime);
            }

            if (duration > 0) {
                const percentWatched = (currentTime / duration) * 100;
                setProgress(percentWatched);

                if (percentWatched >= 98 && !isCompleted) {
                    setIsCompleted(true);
                    console.log("✅ Video fully watched");
                    // Optionally notify backend here
                }
            }
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [lecture, isCompleted]);

    return (
        <>
            {loading ? <Loading /> : <>
                <div className="lecture-page">
                    <div className="left">
                        {
                            lecLoading ? <Loading /> : <>
                                {
                                    lecture.video ? <>
                                        <video
                                            ref={videoRef}
                                            src={`${server}/${lecture.video}`}
                                            width="100%"
                                            controls
                                            controlsList="nodownload noremoteplayback"
                                            disablePictureInPicture
                                            disableRemotePlayback
                                            autoPlay
                                        ></video>

                                        <div style={{ marginTop: "10px" }}>
                                            <p>Progress: {Math.floor(progress)}%</p>
                                            <p>Status: {isCompleted ? "✅ Watched" : "In Progress..."}</p>
                                        </div>

                                        <h1>{lecture.title}</h1>
                                        <h3>{lecture.description}</h3>

                                    </> : <h1>Please Select a Lecture</h1>
                                }
                            </>
                        }
                    </div>
                    <div className="right">
                        {user && user.role === "admin" && (
                            <button className="common-btn" onClick={() => setShow(!show)}>
                                {show ? "Close" : "Add Lecture +"}
                            </button>
                        )}
                        {
                            show && <div className="lecture-form" >
                                <h2>Add Lecture </h2>
                                <form onSubmit={submitHandler}>
                                    <label htmlFor="text">Title</label>
                                    <input type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        required />

                                    <label htmlFor="text">Description</label>
                                    <input type="text"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        required />

                                    <input type="file" placeholder="Choose Video" onChange={changeVideoHandler} required />

                                    {
                                        videoPrev && <video src={videoPrev} alt="" width={300} controls></video>
                                    }

                                    <button disabled={btnLoading} type="submit" className='common-btn'>
                                        {btnLoading ? "Please Wait..." : "Add"}
                                    </button>
                                </form>
                            </div>
                        }
                        {
                            lectures && lectures.length > 0 ? lectures.map((e, i) => (
                                <React.Fragment key={e._id}>
                                    <div onClick={() => fetchLecture(e._id)}
                                        className={`lecture-number ${lecture._id === e._id && "active"}`}>
                                        {i + 1}. {e.title}
                                    </div>
                                    {
                                        user && user.role === "admin" && (
                                            <button className='common-btn'
                                                style={{ background: "red" }}
                                                onClick={() => deleteHandler(e._id)}
                                            >Delete {e.title}</button>
                                        )
                                    }
                                </React.Fragment>
                            )) : <p>No Lectures Yet!</p>
                        }
                    </div>
                </div>
            </>}
        </>
    );
};

export default Lecture;
