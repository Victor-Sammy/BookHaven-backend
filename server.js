const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const errorHandler = require('./middleware/errorHandler')
const connectDb = require('./config/dbConnection')
const MongoDBStore = require('connect-mongodb-session')(session)
const dotenv = require('dotenv')
const bookRoutes = require('./routes/BooksRoutes')
const librayRoutes = require('./routes/myLibraryRoutes')
const historyRoutes = require('./routes/historyRoute')
const googleRoute = require('./routes/googleRoute')
const multer = require('multer')
const Books = require('./models/booksModel')
const Articles = require('./models/articleModel')
const Library = require('./models/libraryModel')
const History = require('./models/historyModel')
const importedFile = require('./passport')
//const pdfModel = require('./models/pdfModel')
//const fs = require('fs')
//const asyncHandler = require('express-async-handler')

connectDb()
dotenv.config()

const origin = 'http://localhost:5173'

const app = express()

// configure the session store
const store = new MongoDBStore({
  uri: process.env.CONNECTION_STRING,
  collection: 'sessions', // Name of the MongoDB collection to store sessions
  expires: 1000 * 60 * 60 * 24 * 7, // Session expiration (e.g., 7 days)
})

app.use(cors())

app.use(cors({ origin, credentials: true }))
app.use(
  session({
    secret: `${process.env.ACCESS_TOKEN_SECRET}`,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
)

const port = process.env.PORT || 5003

app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(helmet())
app.use('/api/articles', require('./routes/articlesRoutes'))
app.use('/api/books', bookRoutes)
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/library', librayRoutes)
app.use('/api/history', historyRoutes)
app.use('/auth', googleRoute)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})

// app.get('/set-session', (req, res) => {
//   req.session.username = req.user
//   res.send('Session data set.')
// })

// app.get('/get-session', (req, res) => {
//   const username = req.session.username || 'Guest'
//   res.send(`Hello, ${username}!`)
// })

// POST NEW PDF DATA TO MONGODB
// POST NEW PDF DATA TO MONGODB
// const pdfBuffer = fs.readFileSync(
//   './assets/life-sc/Yield, chemical composition, and efficiency of utilization of applied nitrogen from BRS Kurumi pastures.pdf'
//   // currently on uploading this
// )

// // storage
// const Storage = multer.diskStorage({
//   destination: 'uploads',
//   filename: (req, file, cb) => {
//     cb(null, file.originalname)
//   },
// })

// const upload = multer({
//   storage: Storage,
// }).single('testPdf')

// app.post('/upload', (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err)
//     } else {
//       const newPdf = new Books({
//         title: req.body.title,
//         author: req.body.author,
//         description: req.body.description,
//         year: req.body.year,
//         resourceType: req.body.resourceType,
//         subject: req.body.subject,
//         pdf: pdfBuffer,
//       })
//       newPdf
//         .save()
//         .then(() => res.send(newPdf))
//         .catch((err) => console.log(err))
//     }
//   })
// })

// app.use('/uploads', express.static('uploads'))

// GET SINGLE PDF OBJECT
// GET SINGLE PDF OBJECT
app.get('/api/:id/:modelName', async (req, res) => {
  const modelName = req.params.modelName

  let Model

  switch (modelName) {
    case 'Books':
      Model = Books
      break
    case 'Articles':
      Model = Articles
      break
    case 'Library':
      Model = Library
      break
    case 'History':
      Model = History
      break
    default:
      return res.status(400).json({ error: 'Invalid model name' })
  }

  const object = await Model.findById(req.params.id)
  if (!object) {
    return res.status(400).send('book not found')
  }

  res.json(object)
})

// DOWNLOAD SINGLE PDF DATA
// DOWNLOAD SINGLE PDF DATA
app.get('/api/:id/:modelName/download', (req, res) => {
  const modelName = req.params.modelName

  let Model

  switch (modelName) {
    case 'Books':
      Model = Books
      break
    case 'Articles':
      Model = Articles
      break
    case 'Library':
      Model = Library
      break
    case 'History':
      Model = History
      break
    default:
      return res.status(400).json({ error: 'Invalid model name' })
  }

  async function convertBufferToBase64() {
    try {
      const pdfData = await Model.findById(req.params.id).select('pdf')
      if (!pdfData) {
        console.log('PDF not found')
        return res.status(404).send('PDF not found')
      }
      // Determine the model dynamically
      //const Model = pdfData
      const base64Data = pdfData.pdf.toString('base64')
      res.setHeader('Content-Type', 'application/pdf')
      res.download(base64Data, 'download.pdf')
      res.status(200).send(base64Data)
      return base64Data
    } catch (error) {
      console.error('Error converting buffer to base64:', error)
      res.status(500).send('Internal Server Error' + error.message)
    }
  }

  async function main() {
    try {
      const base64Data = await convertBufferToBase64(req.params.id)
      console.log(base64Data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  main()
})

// GET SINGLE PDF CONTENT
// GET SINGLE PDF CONTENT
app.get('/api/:id/:modelName/pdf', (req, res) => {
  const modelName = req.params.modelName

  let Model

  switch (modelName) {
    case 'Books':
      Model = Books
      break
    case 'Articles':
      Model = Articles
      break
    case 'Library':
      Model = Library
      break
    case 'History':
      Model = History
      break
    default:
      return res.status(400).json({ error: 'Invalid model name' })
  }
  async function convertBufferToBase64() {
    try {
      const pdfData = await Model.findById(req.params.id).select('pdf')
      if (!pdfData) {
        return res.status(404).send('PDF not found')
      }
      const base64Data = pdfData.pdf.toString('base64')
      res.setHeader('Content-Type', 'application/pdf')
      res.status(200).send(base64Data)
      return base64Data
    } catch (error) {
      console.error('Error converting buffer to base64:', error)
      res.status(500).send('Internal Server Error' + error.message)
    }
  }

  async function main() {
    try {
      const base64Data = await convertBufferToBase64(req.params.id)
      console.log(base64Data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  main()
})

// async function addImageImageToData() {
//   var itemId = '64dce5499c42b57003f03372'
//   const imageUrl = fs.readFileSync('./assets/psychology/colors.jpg')
//   const base64Image = imageUrl.toString('base64')
//   try {
//     const updatedItem = await Article.findByIdAndUpdate(
//       itemId,
//       {
//         $set: {
//           image: base64Image,
//           contentType: 'image/jpeg',
//         },
//       },
//       { new: true }
//     )

//     if (!updatedItem) {
//       console.log('Item not found')
//       return
//     }

//     console.log('Item with image:', updatedItem)
//   } catch (error) {
//     console.error('Error updating item:', error)
//   }
// }

// addImageImageToData()

// async function updatePdf() {
//   // Read the PDF file
//   const pdfData = fs.readFileSync('./assets/science/planets-orbiting.pdf')

//   try {
//     // Find and update the PDF data using Mongoose
//     const updatedPdf = await Article.findByIdAndUpdate(
//       '64dce34c1efaba0d45d1c036', // Replace with the actual document ID
//       { pdfData: pdfData },
//       { new: true } // Return the updated document
//     ).exec()

//     console.log('PDF data updated successfully:', updatedPdf)
//   } catch (err) {
//     console.error('Error updating PDF data:', err)
//   }
// }

// updatePdf()
