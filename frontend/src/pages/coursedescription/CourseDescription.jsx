import React, { useEffect, useState } from 'react';
import './coursedescription.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserData } from '../../context/UserContext';
import Loading from '../../components/loading/Loading';

const CourseDescription = ({user}) => {
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {fetchUser} = UserData();

    const {fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

    useEffect(()=>{
        fetchCourse(params.id);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const checkoutHandler = async () =>{
        const token = localStorage.getItem("token")
        setLoading(true);

        try{
        const {data:{order}} = await axios.post(`${server}/api/course/checkout/${params.id}`,{},{
            headers:{
                token,
            },
        });

        const options ={
            "key": "rzp_test_bvvPARgR4UsQAj", // Enter the Key ID generated from the Dashboard
            "amount": order.amount, // Amount is in currency subunits. 
            "currency": "INR",
            "name": "Tutorial Platform", //your business name
            "description": "Learn with Us",
            "order_id": order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1

            handler: async function(response) {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
                try {
                   const {data} = await axios.post(`${server}/api/verification/${params.id}`,{
                    razorpay_order_id, 
                    razorpay_payment_id, 
                    razorpay_signature,
                   },
                {
                    headers:{
                        token,
                    }
                }); 

                await fetchUser();
                await fetchCourses();
                await fetchMyCourse();
                toast.success(data.message);
                setLoading(false);
                navigate(`/payment-success/${razorpay_payment_id}`);
                } catch (error) {
                    toast.error(error?.response?.data?.message || "Payment verification failed");
                    setLoading(false);
                }
            },
            theme:{
                color: "#8a4baf",
            },
        };
        const razorpay = new window.Razorpay(options);

        razorpay.open();
        }catch(error){
            toast.error(error?.response?.data?.message || "Checkout failed");
            setLoading(false);
        }
    };
    
  return (
   <>
    {
        loading? (<Loading/>
         ) : ( <>
        {course && <div className="course-description">
            <div className="course-header">
                <img src={`${server}/${course.image}`} alt=" " 
                className="course-image"/>
                <div className="course-info">
                    <h2>{course.title}</h2>
                    <p>Instructor: {course.createdBy}</p>
                    <p>Duration: {course.duration} weeks</p>
                </div>
            </div>

             <p>{course.description}</p>


            <p>Lets get Started with this Course At ₹{course.price}</p>

                {
                    user && user.subscription.includes(course._id) ? (
                    <button onClick={()=>navigate(`/course/study/${course._id}`) } 
                    className='common-btn'>Study</button> 
                    ):(
                    <button onClick={checkoutHandler} className='common-btn'>Buy-Now</button>)
                }
        </div>}
    </>
    )}
   </>
  );
};

export default CourseDescription