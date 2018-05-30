const mongoose = require('mongoose')
var auto = require('mongoose-plugin-autoinc')
var autoIncrement = auto.autoIncrement;
const Schema = mongoose.Schema
var db = mongoose.connection;
var fs = require('fs')
var path = require('path')
mongoose.connect("mongodb://localhost/dongye");

db.once('open', function () {
  console.log('链接成功')
});


var BookSchema = new mongoose.Schema({
  imgSrc: String,
  bookName: String,
  summery: String,
  author: String,
  text: Array
});

BookSchema.plugin(autoIncrement, {
  model: 'higashinokeigo',
  field: 'id',
  startAt: 10,
  incrementBy: 1
});


const Book = mongoose.model('higashinokeigo', BookSchema);
// var data = new Book({
//   imgSrc: 'http://zuopinj.com/d/file/wgxs/dongyeguiwu/20150912/ccce013f28b3a3be98207d1c5e7e0b65.jpg',
//   bookName: 'bookName',
//   summery: '她是谁？他到底失去的是妻子还是女儿？大巴滚落山谷，',
//   author: '东野圭吾'
// })
// data.save(err => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('Save success')
//   }
// })

(async () => {
  var data = await Book.find({});
  var datas = []
  await data.forEach((v, i) => {
    delete v.id
    delete v._id
    delete v.bookId
    let text = v.text
    text.forEach((val, ind) => {
      val['chapterid'] = ind + 1;
    })
  })
  // 储存file
  // await fs.writeFile('data.json', JSON.stringify(data), err => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log('储存完成')
  //   }
  // })
  // 读取并重新储存
  await fs.readFile(path.resolve(__dirname, "data.json"), 'utf-8', (err, data) => {
    data = JSON.parse(data)
    // console.log(data.length)
    data.forEach(function (v, i) {
      delete v._id;
      delete v.id;
      delete v.bookId;
      var json = {
        imgSrc: v.imgSrc,
        bookName: v.bookName,
        summery: v.summery,
        author: v.author,
        text: v.text
      }
      var bookdata = new Book(json)
      bookdata.save(err => {
        if (err) {
          console.log(err)
        } else {
          console.log('success')
        }
      })
    }, this);
  })
})()


// for (let i = 0; i < 10; i++) {

// }