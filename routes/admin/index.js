const express = require('express')
const Category = require('../../models/Category')
const router = express.Router()
const Post = require('../../models/Post')
const path = require('path')

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

router.delete('/posts/:id', (req, res) => {

    Post.deleteOne({ _id: req.params.id }).lean().then(categories => {
        res.redirect('/admin/posts')
    })

})

router.get('/posts/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).lean().then(post => {
        Category.find({}).lean().then(categories => {
            res.render('admin/editPost', {post:post, categories:categories})
        })
    })
})

router.put('/posts/:id', (req, res) => {
    let post_image = req.files.post_image
    post_image.mv(path.resolve(__dirname, '../../public/img/postImages', post_image.name))

    Post.findOneAndUpdate({_id: req.params.id}, {$set:{
        title: req.body.title,
        content: req.body.content,
        date: req.body.date,
        category: req.body.category,
        post_image: `/img/postImages/${post_image.name}`
    }}).lean().then(post => {
        
        res.redirect('/admin/posts')

    })

})

module.exports = router