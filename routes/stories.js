const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const Story = require('../models/story')

// const Story = require('../models/Story')

// @desc    Login/Landing page
// @route   GET / stories /add
router.get('/add', ensureAuthenticated, async (req, res) => {
  res.render('stories/add')
})

router.post('/', async (req, res) => {
    try {
     req.body.user = req.user.id
      await Story.create(req.body)
      res.redirect('/dashboard')        
    } catch (err) {
        console.log(err);
    }
})

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const stories = await Story.find({status : 'public'})
    .populate('user')
    .sort({ createAt: 'desc'})
    .lean()
    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.log(err);
  }
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
   try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if (!story) {
      return console.error(err)
    }

    if (story.user._id != req.user.id && story.status == 'private') {
      console.error(err)
    } 
    else {
      res.render('stories/show', {
        story,
      })
    }
  } catch (err) {
    console.error(err) 
  }
})

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const story = await Story.findOne({_id: req.params.id}).lean()
  if(!story) {
    console.log(err);
  }
  if(story.user != req.user.id) {
    res.redirect('/stories')

  }
  else {
    res.render('stories/edit', {story})
  }
})


router.put('/:id', ensureAuthenticated, async (req, res) => {
  let story = await Story.findById(req.params.id)
  if (!story) {
    console.log(err);
  }
   if(story.user != req.user.id) {
    res.redirect('/stories')

  }
  else {
    story = await Story.findOneAndUpdate({_id: req.params.id}, req.body,{
      new: true,
    })
    res.redirect('/dashboard')
  }
})

router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    let story = await Story.findOne({_id: req.params.id}).lean()

    if (!story) {
      console.log(err);
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.deleteOne({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
  }
})

router.get('/user/:userId', ensureAuthenticated, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    
  }
})


module.exports = router