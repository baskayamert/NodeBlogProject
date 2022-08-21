const express = require('express')
const Category = require('../../models/Category')
const router = express.Router()
const Post = require('../../models/Post')

router.get('/', (req, res) => {

    res.render('admin/index')

})

router.get('/categories', (req, res) => {

    Category.find({}).sort({ $natural: -1 }).lean().then(categories => {
        res.render('admin/categories', { categories: categories })
    })

})

router.post('/categories', (req, res) => {

    Category.create(req.body, (error, category) => {
        if (!error) {
            res.redirect('categories')
        }
    })

})

router.delete('/categories/:id', (req, res) => {

    Category.deleteOne({ _id: req.params.id }).lean().then(categories => {
        res.redirect('/admin/categories')
    })

})

router.get('/posts', (req, res) => {

    Post.find({}).populate({path:'category', model: Category}).sort({$natural:-1}).lean().then(posts => {
        
        res.render('admin/posts', {posts:posts})
        
        
    })


})

module.exports = router