const express = require('express');
const router = express.Router();
const { Course, User } = require('./models');
//const { authenticateUser } = require('./middleware/auth-user');

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
router.get('/users', asyncHandler ( async (req, res) => {
    const user = await req.user;
    res.status(200).json({ user });
}));

//Route to create new user in database
router.post('/users', asyncHandler (async(req, res, next) => {
    try {
        await User.create(req.body);
        res.status(201).location('/');
        next();
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
//
router.get('/courses', asyncHandler ( async (req, res) => {
    let courses = await Course.findAll({ include: User});
    res.status(200).json(courses);
}));

//Route to return a single course
router.get('/courses/:id', asyncHandler ( async (req, res) => {
    let courseId = req.params.id;
    let course = await Course.findByPk(courseId, { include: User });
    res.status(200).json(course);
}));

//Route to create a new course entry
router.post('/courses', asyncHandler ( async (req, res, next) => {
    try {
        await Course.create(req.body);
        //res.set('Location', `/courses/${}`)
        res.status(201).send();
        
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

//Route to delte a course entry
router.delete('/courses/:id', asyncHandler ( async (req, res) => {
    let courseId = req.params.id;
    await Course.destroy({ where: {id: courseId}});
    res.status(204).send();
}));

module.exports = router;