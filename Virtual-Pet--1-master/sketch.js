//Create variables here
var dog
var happyDog
var database
var foodS
var foodStock
var changeGameState
var readGameState
var bedroom
var garden
var washroom

function preload()
{
	//load images here
  dogImage = loadImage("images/dogImg.png")
  happyDogImage = loadImage("images/dogImg1.png")
  bedroom = loadImage("images/Bed Room.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Wash Room.png")
}

function setup() {
	createCanvas(500, 500);
  database = firebase.database()
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

  dog = createSprite(250,250,10,10)
  dog.addImage(dogImage)
  dog.scale = 0.2
  food = new Food()
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  function feedDog(){
    dog.addImage(happyDog);
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  } 

  function addFoods(){
    foodS++;
    database.readStock('/').update({
      Food:foodS
    })
  }
}


function draw() {
  background(46,139,87)
  drawSprites();
  textSize(20)
  fill("lime")
  text("Note: Press UP_ARROW Key To Feed Drago Milk!")
  food.display();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  //add styles here 
  //if(keyWentDown(UP_ARROW)  ){
    //writeStock(foodS);
    //dog.addImage(dogHappy);
  //}
  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })  

  fill(255,255,254); 
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM", 350,30);
  }else if(lastFed==0){
    text("Last Feed : 12AM",350,30);
  }else{
    text("Last Feed"+ lastFed + "AM", 350,30);
  }

  if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }

}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  database.ref('/').update({
    Food:x
  })
}

function update(state){
  databse.ref('/').update({
    gameSate:state
  });
}