const express = require("express");
const router = express.Router();
const cors = require("cors");

const corsOptions = {
    origin: 'https://tradevister.vercel.app', 
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  };

  //http://localhost:5173 
  
  router.use(cors(corsOptions));
  router.options('*', cors(corsOptions)); 

const { test, loginUser, createUser, loginAdmin } = require("../controllers/authController");

router.get('/test', test);
router.post('/login', loginUser);
router.post('/register', createUser);
router.post('/adminAuth', loginAdmin);

module.exports = router;