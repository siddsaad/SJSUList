const express = require('express');
const router = express.Router();
const { getItem, addItem, itemId,getItemByUserId,updateItem,deleteItem,thePoster,getItems} = require('../controller/ItemController');
const {userId} = require("../controller/UserController");


router.get("/", getItems);
router.post("/addItem/:userId", addItem);

router.get("/itemsby/:userId",getItemByUserId);

//update item using item id
router.put("/itemupdate/:postId",updateItem);

//remove item post from database
router.delete("/itemdelete/:postId", deleteItem);

// any route containing :userId, our app will first execute userId()
router.param("userId", userId);
// any route containing :postId, our app will first execute itemdId()
router.param("postId", itemId);


module.exports = router;