/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
 
var expect = require('chai').expect;
var MongoClient = require('mongodb');
//var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: 
mongoose.connect(MONGODB_CONNECTION_STRING, {useNewUrlParser: true}).then(() => console.log('Connected'))
  .catch(error => console.log(error));
var Schema = mongoose.Schema;
 
var book = new Schema({title:{type:String}, comment:{type:[String]}});
var Book = mongoose.model('Book',book);

module.exports = function (app) {
  
  app.route('/api/books')
    .get(function (req, res){
      Book.find({},function (err,data) {
        res.json(data);
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      console.log(title);
      var newBook = new Book({title:title, comment:[]});
      console.log('step forward........')
      newBook.save(function (err,data) { 
                        console.log('save is runing')
                        if (err) return console.error(err);
                        res.json(data);
                      });      
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.deleteMany({},(err,data)=>{
        if(err){
          console.log(err)
        }else{
          res.json({status:'complete delete successful'})
        }
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findById({_id:bookid},function (err,data) { 
        res.json(data);
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      var newComment;
      Book.findById({_id:bookid},function (err,data) {    
                                    if (err) return console.error(err);
                                    newComment = data.comment;
                                    newComment = newComment?newComment:[];
                                    console.log(newComment);
                                    console.log(data.title);
                                    newComment.push(comment);
                                    console.log(newComment);
              Book.findOneAndUpdate({_id:bookid}, {comment:newComment},{new:true},function (err,data) {    
                                                                          if (err) return console.error(err);
                                                                          res.json(data);
                    });
                });

      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book.findByIdAndRemove({_id:bookid},function (err,data) { 
        if(err){
          console.log(err)
        } else{
          res.json({status:bookid+' deleted successfully'})
        }
      })
      //if successful response will be 'delete successful'
    });
  
};
