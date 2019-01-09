const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10   //加盐加密的算法权重值
const MAX_LOGIN_ATTEMPTS = 5  //最大登录尝试次数
const LOCK_TIME = 2 * 60 * 60 * 1000  //两个小时的登录错误锁定时间

const UserSchema = new Schema({
  phoneNumber: {
    unique: true,
    required: true,
    type: String,
  },
  areaCode: {
    type: String,
  },
  verifyCode: {
    type: String,
  },
  accessCode: {
    type: String,
  },
  nickname: {
    type: String,
  },
  gender: String,
  breed: String,
  avatar: String,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

//虚拟字段，不会存到数据库中，表示用户是否被锁定,两次取反？？？
UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

//增加一个中间件,生成时间和更新时间
UserSchema.pre('save', function (next) {
 //这个this.isNew可以用来判断一条要save的数据是不是新数据
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  } 

  next()
})

//增加一个中间件,对用户密码进行加盐
// UserSchema.pre('save', function (next) {
//   if (!this.isModified('password')) return next()

//   bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
//     if (err) return next(err)

//     bcrypt.hash(this.password, salt, (error, hash) => {
//       if (error) return next(error)

//       this.password = hash
//       next()
//     })
//   })
// })


//实例方法，比较密码，和判断登录尝试次数
// UserSchema.methods = {
//   comparePassword: (_password, password) => {
//     return new Promise((resolve, reject) => {
//       bcrypt.compare(_password, password, (err, isMatch) => {
//         if (!err) resolve(isMatch)
//         else reject(err)
//       })
//     })
//   },

//   incLoginAttepts: (user) => {
//     return new Promise((resolve, reject) => {
//       if (this.lockUntil && this.lockUntil < Date.now()) {
//         this.update({
//           $set: {
//             loginAttempts: 1
//           },
//           $unset: {
//             lockUntil: 1
//           }
//         }, (err) => {
//           if (!err) resolve(true)
//           else reject(err)
//         })
//       } else {
//         let updates = {
//           $inc: {
//             loginAttempts: 1
//           }
//         }

//         if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
//           updates.$set = {
//             lockUntil: Date.now() + LOCK_TIME
//           }
//         }

//         this.update(updates, err => {
//           if (!err) resolve(true)
//           else reject(err)
//         })
//       }
//     })
//   }
// }

mongoose.model('User', UserSchema)