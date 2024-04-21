const express = require(`express`);
const monk = require('monk');
const Joi = require('@hapi/joi');
require('dotenv').config();

const db = monk(process.env.MONGO_URI);
const faqs = db.get('faqs');

  const schema = Joi.object({
         question:Joi.string().trim().required(),
         answer:Joi.string().trim().required(),
         video_url:Joi.string().uri(),
      });

db.then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


const router = express.Router();

// Read all faqs
router.get('/', async (req, res, next) => {
  try {
    const items = await faqs.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

//read one
router.get('/:id', async(req,res,next)=>{
 try {

   const { id } = req.params;
   const item = await faqs.findOne({
      _id : id,
   });
   if(!item) return next();
   return res.json(item);
 } catch (error) {
   next(error);
 }
});
//create one
router.post('/',async(req,res,next)=>{

   try {
      console.log(req.body);
    const value = await schema.validateAsync(req.body);
    const inserted = await faqs.insert(value);
    res.json(inserted);


   } catch (error) {
      next(error);
   }
});

//update one 
router.put('/:id',async(req,res,next)=>{

   try {
      const {id} = req.params;
      console.log(req.body);
      const value = await schema.validateAsync(req.body);
    const item = await faqs.findOne({
      _id : id,
   });
   
      if(!item) return next();
     const updated = await faqs.update({
      _id : id,
   },{
      $set:value,
   });
   //  res.json(updated);
      res.json(value);
   } catch (error) {
      next(error);
   }
});

//delete one 
router.delete('/:id',async(req,res,next)=>{

   try {
      const { id } = req.params;
      await faqs.remove({
         _id:id
      });
      // res.status(200).send(`Sucess ^_^`);
      res.json({
         message:`Success delete`,
      })
   } catch (error) {
      next(error);
      
   }

});

module.exports = router;