const express = require('express');
const router = express.Router();
const { Course, User } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

function asyncHandler(cb){
    return async(req, res, next) => {
        try{
            await cb(req, res, next)
        } catch(error){
            next(error);
        }
    }
}

//Users Routes

//Route to return currently authenticated user
router.get('/users', authenticateUser, asyncHandler ( async (req, res) => {
    const user = await req.currentUser;
    res.status(200).json({ user });
}));

//Route to create new user in database
router.post('/users', asyncHandler (async(req, res, next) => {
    try {
        await User.create(req.body);
        res.status(201).location('/').end();
    } catch (error) {
        console.log('There was an error: ', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
    }
}))

//Courses Routes

//Route to return a list of all courses
router.get('/courses', asyncHandler ( async (req, res) => {
    let courses = await Course.findAll({ include: User});
    res.status(200).json(courses);
}));

//Route to return a single course
router.get('/courses/:id', asyncHandler ( async (req, res) => {
    let courseId = req.params.id;
    let course = await Course.findByPk(courseId, { include: User });
    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: "This course does not exist."});
    }
    
}));

//Route to create a new course entry
router.post('/courses', authenticateUser ,asyncHandler ( async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/api/courses/${course.id}`).end();
    } catch (error) {
        console.log('ERROR', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
    }
}));

//Route to update a course entry
router.put('/courses/:id', authenticateUser ,asyncHandler(async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        await course.update(req.body);
        res.status(204).end();
    } catch (error) {
        console.log('ERROR', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
    }
}));

//Route to delete a course entry
router.delete('/courses/:id', authenticateUser ,asyncHandler ( async (req, res) => {
    let courseId = req.params.id;
    await Course.destroy({ where: {id: courseId}});
    res.status(204).send();
}));

module.exports = router;