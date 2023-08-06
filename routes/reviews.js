const express = require('express')
const router = express.Router({ mergeParams: true })
const Campground = require('../models/campground')
const Review = require('../models/reviews.js')
const reviews = require('../controllers/reviews')
const { reviewSchema } = require('../schema.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')



router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

router.post('/', isLoggedIn, catchAsync(reviews.createReview))

module.exports = router;