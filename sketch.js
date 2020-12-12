var trex,trex_run,trex_collide,trex_jump;
var edges; 
var ground,ground_image;
var invisibleGround;
var cloud,cloudImage;
var obstacle,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score = 0;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var obstaclesGroup;
var cloudsGroup;
var gameover,gameoverImage;
var restart,restartImage;
var jumpSound,disSound,checkPointSound;



function preload(){
  trex_run=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collide=loadAnimation("trex_collided.png");
  trex_jump=loadAnimation("trex1.png");
  ground_image=loadImage("ground2.png");
  cloudImage=loadImage("cloud.png")
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
    obstacle3=loadImage("obstacle3.png");
    obstacle4=loadImage("obstacle4.png");
    obstacle5=loadImage("obstacle5.png");
    obstacle6=loadImage("obstacle6.png");  
    gameoverImage=loadImage("gameOver.png");
    restartImage=loadImage("restart.png");
    jumpSound=loadSound("jump.mp3");
    dieSound=loadSound("die.mp3");
    checkPointSound=loadSound("checkPoint.mp3");
  
}

function setup(){
  createCanvas(600,200);
  
  //creating trex sprite
  trex=createSprite(50,160,20,50);
  trex.addAnimation("trexrun",trex_run);
  trex.addAnimation("trexcollide",trex_collide);
  trex.addAnimation("trexjump",trex_jump);
  trex.scale=0.5;
  //trex.debug=true
  trex.setCollider("rectangle",0,0,trex.width,trex.height)
  
  
  //creating ground sprite
  ground=createSprite(300,180,600,10);
  ground.addImage("ground",ground_image);

  //creating invisibleGround
  invisibleGround=createSprite(300,190,600,10);
  invisibleGround.visible=false; 
  
  //game over and restart
  gameover=createSprite(300,100)
  gameover.addImage("gameover",gameoverImage);
  gameover.scale=0.5
  gameover.visible=false
  
  restart=createSprite(300,140)
  restart.addImage("restart",restartImage);
  restart.scale=0.5;
  restart.visible=false

  edges=createEdgeSprites()
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  
}

function draw(){
  //console.time()
  //console.log(getFrameRate())
  //frameRate(10)
  //clearing background
  background("yellow");
  
  if(gamestate === PLAY) {
  if (trex.y<161.5) {
    trex.changeAnimation("trexjump");
  }
    else {
      trex.changeAnimation("trexrun");
    }
  score = score + Math.round(getFrameRate()/40);
  if (score % 100 === 0 && score>0) {
  checkPointSound.play()
  }
  
  //trex jump
  if (keyDown("space")&&trex.y>=161.5){
    trex.velocityY=-10;
    jumpSound.play()
  }
    ground.velocityX =-(4+score/100);

  //to reset the ground
  if (ground.x<0){
    ground.x=ground.width/2;
  }
  
  //trex gravity
  trex.velocityY=trex.velocityY+0.5;
    
  spawnClouds()
  spawnObstacles()
    
  if(trex.isTouching(obstaclesGroup)){
    dieSound.play(); 
    gamestate = END 
    //trex.velocityY=-10
    //jumpSound.play();
  }
  }
  
  else if(gamestate === END) {
  
  ground.velocityX = 0;
  cloudsGroup.setVelocityXEach(0);
  obstaclesGroup.setVelocityXEach(0);
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
  trex.changeAnimation("trexcollide");
  trex.velocityY = 0;
  gameover.visible=true;
  restart.visible=true;
    
  //trex restart
  if(mousePressedOver(restart)) {
    reset();
  }
   }
  
  //to display score
  text("score "+score,500,50);
  
  //console.log(trex.y)

  //to support trex   
  trex.collide(invisibleGround);

  drawSprites();
 // console.timeEnd()
}

function reset () {
  gamestate = PLAY;
  score = 0;
  trex.changeAnimation("trexrun")
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  restart.visible=false;
  gameover.visible=false;
} 

function spawnClouds () {
  
  if (frameCount % 80 === 0 ) {
  cloud=createSprite  (600,100);
  cloud.velocityX=-(3+score/100) ;
  cloud.addImage(cloudImage);
  cloud.scale=0.8;
  cloud.y=Math.round(random(60,120));
  trex.depth=cloud.depth+1;
  cloud.lifetime=210;
  cloudsGroup.add(cloud);
}
}

function spawnObstacles(){
  if(frameCount % 110 === 0){
  obstacle = createSprite (600,165  );
  obstacle.velocityX=-(6+score/100);
  var r = Math.round(random(1,6))
  switch(r){
  case 1:obstacle.addImage(obstacle1);
  break;
   case 2:obstacle.addImage(obstacle2);
  break;    
   case 3:obstacle.addImage(obstacle3);
  break;
   case 4:obstacle.addImage(obstacle4);
  break;
   case 5:obstacle.addImage(obstacle5);
  break;    
   case 6:obstacle.addImage(obstacle6);
  break;
  default:break;
  }
  obstacle.scale=0.6;
  obstacle.lifetime=110;
  obstaclesGroup.add(obstacle);
  }
  
}
