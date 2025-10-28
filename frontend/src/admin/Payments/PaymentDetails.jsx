import React, { useEffect, useState } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";
import "./paymentdetails.css";

const PaymentDetails = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPayments() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/payments`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setPayments(data.payments || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Failed to fetch payments");
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Layout>
      <div className="payment-details">
        <h1>Payment Details</h1>
        {loading ? (
          <p>Loading...</p>
        ) : payments && payments.length > 0 ? (
          <div className="payments-table">
            <div className="payments-header">
              <span>User</span>
              <span>Course</span>
              <span>Price (₹)</span>
              <span>Payment ID</span>
              <span>Date</span>
            </div>
            {payments.map((p) => (
              <div className="payments-row" key={p._id}>
                <span>{p.user?.name || "Unknown User"}</span>
                <span>{p.course?.title || "Unknown Course"}</span>
                <span>{p.price ?? p.course?.price ?? p.amount ?? "-"}</span>
                <span>{p.razorpay_payment_id}</span>
                <span>{new Date(p.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No payments found</p>
        )}
      </div>
    </Layout>
  );
};

export default PaymentDetails;


