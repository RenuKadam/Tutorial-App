import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { instance } from "../index.js";

export const createCourse = TryCatch(async (req, res) =>{
    const {title, description, category, createdBy, duration, price} = req.body;

    const image = req.file;

    await Courses.create({
        title,
        description,
        category,
        createdBy,
        image: image?.path,
        duration,
        price,
    });
    res.status(201).json({
       message:"Course created successfully",
    });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  
  if(!course) 
    return res.status(404).json({ 
        message: "No course found with this ID", 
    });

    const { title, description } = req.body;

    const file = req.file 

    const lecture = await Lecture.create({
        title,
        description,
        video: file?.path,
        Course: course._id,
    });

    res.status(201).json({
        message: "Lecture added",
        lecture
    });
});

export const deleteLecture = TryCatch(async(req, res)=>{
    const lecture = await Lecture.findById(req.params.id);

    rm(lecture.video,()=>{
        console.log("video deleted");
    });

    await lecture.deleteOne();

    res.json({
        message: "Lecture deleted successfully",
    });
});

const unlinkAsync = promisify(fs.unlink);

export const updateCourse = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { title, description, category, createdBy, duration, price } = req.body;

    const course = await Courses.findById(id);

    if (!course) {
        return res.status(404).json({
            message: "Course not found",
        });
    }

    if (typeof title !== 'undefined') course.title = title;
    if (typeof description !== 'undefined') course.description = description;
    if (typeof category !== 'undefined') course.category = category;
    if (typeof createdBy !== 'undefined') course.createdBy = createdBy;
    if (typeof duration !== 'undefined') course.duration = duration;
    if (typeof price !== 'undefined') course.price = price;

    if (req.file) {
        try { if (course.image) await unlinkAsync(course.image); } catch (e) {}
        course.image = req.file.path;
    }

    await course.save();

    res.json({
        message: "Course updated successfully",
        course,
    });
});

export const deleteCourse = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return res.status(404).json({
            message: "Course not found",
        });
    }

    const lectures = await Lecture.find({Course: course._id});

    await Promise.all(
    lectures.map(async(lecture)=>{
        await unlinkAsync(lecture.video);
        console.log("video deleted");
    })
);

rm(course.image,()=>{
        console.log("image deleted");
    });

    await Lecture.find({ Course: req.params.id }).deleteMany();

    await course.deleteOne();

    await User.updateMany({}, {$pull: {subscription: req.params.id} });
    
    res.json({
        message: "Course deleted successfully",
    });
});

export const getAllStats = TryCatch(async(req, res)=>{
    const totalCourses = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length; 

    const stats ={
        totalCourses,
        totalLectures,
        totalUsers,
    };

    res.json({
        stats,
    });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } })
    .select("-password")
    .populate({ path: "subscription", select: "title" });

  res.json({ users });
});

export const deleteUser = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() === id) {
    return res.status(400).json({
      message: "You cannot delete yourself",
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  await user.deleteOne();

  res.json({
    message: "User deleted successfully",
  });
});

export const getAllPayments = TryCatch(async (req, res) => {
  const payments = await Payment.find()
    .populate({ path: "user", select: "name email" })
    .populate({ path: "course", select: "title price" })
    .sort({ createdAt: -1 });

  const enriched = await Promise.all(
    payments.map(async (p) => {
      if (p.user && p.course && (p.price || p.amount)) {
        return p;
      }

      try {
        const order = await instance.orders.fetch(p.razorpay_order_id);
        const courseId = order?.notes?.courseId;
        const userId = order?.notes?.userId;

        const [user, course] = await Promise.all([
          !p.user && userId ? User.findById(userId).select("name email") : p.user,
          !p.course && courseId ? Courses.findById(courseId).select("title price") : p.course,
        ]);

        const obj = p.toObject();
        obj.user = user || p.user || null;
        obj.course = course || p.course || null;
        if (!obj.price) obj.price = obj.course?.price || obj.amount || null;
        return obj;
      } catch (e) {
        const obj = p.toObject();
        if (!obj.price) obj.price = obj.amount || null;
        return obj;
      }
    })
  );

  res.json({ payments: enriched });
});

