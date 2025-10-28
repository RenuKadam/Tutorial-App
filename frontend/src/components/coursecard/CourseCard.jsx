import React, { useState } from 'react';
import './courseCard.css';
import { server } from '../../main';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext';
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from '../../context/CourseContext';

const  CourseCard = ({course}) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();

  const { fetchCourses } = CourseData();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);

  const openEdit = () => {
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setCreatedBy(course.createdBy);
    setCategory(course.category);
    setDuration(course.duration);
    setImage(null);
    setIsEditing(true);
  };

  const onFileChange = (e) => setImage(e.target.files[0] || null);

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response.data.message);
      }  
    }
  };
  
  const saveHandler = async () => {
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('price', price);
      form.append('createdBy', createdBy);
      form.append('category', category);
      form.append('duration', duration);
      if (image) form.append('file', image);

      const { data } = await axios.put(`${server}/api/course/${course._id}`, form, {
        headers: { token: localStorage.getItem('token') },
      });
      toast.success(data.message);
      setIsEditing(false);
      fetchCourses();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed');
    }
  };
  return (
    <div className="course-card">
        <img src={`${server}/${course.image}`} alt="" className="course-image" />
        <h3>{course.title}</h3>
        <p>Instructor- {course.createdBy}</p>
        <p>Duration- {course.duration} Weeks</p>
        <p>Price- ₹{course.price}</p>
        {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="common-btn"
                >
                  Get Started
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}

      <br />

      {user && user.role === "admin" && (
        <>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={openEdit} className="common-btn">Edit</button>
            <button
              onClick={() => deleteHandler(course._id)}
              className="common-btn"
              style={{ background: "red" }}
            >
              Delete
            </button>
          </div>

          {isEditing && (
            <div className="edit-modal">
              <div className="edit-card">
                <h3>Edit Course</h3>
                <label>Title</label>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} />
                <label>Description</label>
                <input value={description} onChange={(e)=>setDescription(e.target.value)} />
                <label>Price</label>
                <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} />
                <label>Created By</label>
                <input value={createdBy} onChange={(e)=>setCreatedBy(e.target.value)} />
                <label>Category</label>
                <input value={category} onChange={(e)=>setCategory(e.target.value)} />
                <label>Duration (weeks)</label>
                <input type="number" value={duration} onChange={(e)=>setDuration(e.target.value)} />
                <label>Replace Image (optional)</label>
                <input type="file" onChange={onFileChange} />

                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={saveHandler} className="common-btn">Save</button>
                  <button onClick={()=>setIsEditing(false)} className="common-btn" style={{background:'#6b7280'}}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default CourseCard