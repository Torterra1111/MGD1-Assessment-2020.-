class Background
{
    constructor(x, y, imageSRC, velx, vely, spType)
    {
        this.zindex = 0;
        this.x = x;
        this.y = y;
        this.vx = velx;
        this.vy = vely;
        this.sType = spType;
        this.sImage = new Image();
        this.sImage.src = imageSRC;
    }

    // Method
    scrollBK(delta)
    {
        canvasContext.save();
        canvasContext.translate(0, -delta);
        canvasContext.drawImage(this.sImage,0, 0);
        canvasContext.drawImage(this.sImage, 0, this.sImage.height);
        canvasContext.restore();
    }
    // Method
    sPos(newX,newY)
    {
        this.x = newX;
        this.y = newY;
    }

    // Static Method
    static distance(a, b)
    {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
    }

}
//Ship Class
class PlayerShip
{
    constructor(x, y, imageSRC)
    {
            this.x = x;
            this.y = y;
            this.sImage = new Image();
            this.sImage.src = "Ship.png";
            //Expltest.png Ship.png

            this.AttackSpeed = 500;
            this.BulletNumber = 0;
            this.damage = 25;
            this.speed = 200;
            this.accuracy = 200;
            this.Timer = new Date().getTime();
            this.attacktimer = new Date().getTime() - this.Timer;
    }

    render()
    {
        if(this.sImage.complete)
        {
            this.width =  this.sImage.width;
            this.height = this.sImage.height;
            canvasContext.drawImage(this.sImage, this.x, this.y);
        }
    }

    update(delta)
    {
        attacktimer = new Date().getTime() - this.Timer;
        //KEYBOARD
        if (keys[40]) //Down
        {
            if(pShip.y<(canvas.height-pShip.sImage.height-1))
            {
                pShip.y+= delta * this.speed;
            }
        }
        if (keys[38]) //Up
        {
             if(pShip.y>400)
             {
                pShip.y -= delta * this.speed;

             }
        }
        if (keys[39]) //Right
        {
            if((pShip.x)<(canvas.width-pShip.sImage.width - 5))
            {
                pShip.x+= delta * this.speed;
            }
        }
        if (keys[37]) //Left
        {
            if(pShip.x>pShip.sImage.width-30)
            {
                pShip.x -= delta * this.speed;
            }
        }
        //MOUSE
        if(mouseIsDown == 1)
        {
            if((this.x+ this.width/2) > controlX)
            {
                if(pShip.x>pShip.sImage.width-30)
                {
                    pShip.x -= delta * pShip.speed;
                }
            }
            else
            {
                if((pShip.x)<(canvas.width-pShip.sImage.width - 5))
                {
                    pShip.x += delta * pShip.speed;
                }
            }

            if((this.y+ this.height/2) < controlY)
            {
                if(pShip.y<(canvas.height-pShip.sImage.height-1))
                {pShip.y += delta * pShip.speed;}
            }
            else
            {
               pShip.y -= delta * pShip.speed;
            }
        }
        if((attacktimer>this.AttackSpeed))
        {
            var Toshoot = new PlayerBullet(this.x+15,this.y,this.damage,0,0);
            pBullet.push(Toshoot);
            for(var i = 0; i < this.BulletNumber; i++)
            {
                var e = new PlayerBullet(this.x+15,this.y,this.damage,getRandomNumber(10,this.accuracy),getRandomNumber(1,2));
                pBullet.push(e);
            }

            this.Timer = new Date().getTime();

        }
    }

}

class PlayerBullet
{
    constructor(x, y, damage, bulletspread, move)
    {
        this.x = x;
        this.y = y;
        this.r = 6;
        this.sImage = new Image();
        this.sImage.src = "PlayerBullet.png";
        this.Remove = false;

        this.damage = damage;
        this.dx = bulletspread;
        this.flop = move;
    }

    render()
    {
        if(this.sImage.complete)
        {
       	    this.width =  this.sImage.width;
            this.height = this.sImage.height;
       		canvasContext.drawImage(this.sImage, this.x, this.y);
       	}
    }

    update(delta)
    {

        this.y -= delta * 250;
        //If colision with enemy, they go bye bye
        for(var j = 0; j < EnemyWave.length; j++)
        {
            if(this.hits(EnemyWave[j]))
            {
                EnemyWave[j].hp -= this.damage;
                BossOof.play();
                this.Remove = true;
            }
        }
        //If they hit the top of the arena, the go bye bye
        if(this.y < 0)
        {
            this.Remove = true;
        }
        //Only shoot after TIMEFRAME

        switch(this.flop)
        {
        case(1):
            this.x += delta * this.dx;
            break;
        case(2):
            this.x -= delta * this.dx;
            break;
        default:
            this.x += 0;
            break;
        }
    }

    hits(object)
    {
	    if(this.sImage.complete){

        var vX = (this.x + (this.width / 2)) - (object.x + (object.width / 2));
        var vY = (this.y + (this.height / 2)) - (object.y + (object.height / 2));
        var hWidths = (this.width / 2) + (object.width / 2);
        var hHeights = (this.height / 2) + (object.height / 2);
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
        {
            return true
        }
        else
        {
            return false;
        }
        /*
        var d = dist(this, object)
        if(d < this.r + object.r)
        {
            return true
        }
        else
        {
            return false;
        }
        */
	    }
    }
}

class EnemyBullet
{
    constructor(x, y, dx, Move)
    {
        this.x = x;
        this.y = y;
        this.r = 6;
        this.sImage = new Image();
        this.sImage.src = "Bullot.png";
        this.Remove = false;
        this.Hit = false;

        this.BetaX = dx;
        this.flop = Move;
    }

    render()
    {
        if(this.sImage.complete)
        {
       	    this.width =  this.sImage.width;
            this.height = this.sImage.height;
       		canvasContext.drawImage(this.sImage, this.x, this.y);
       	}
    }

    update(delta)
    {
        this.y += delta * 250;
        //If colision with enemy, they go bye bye
        for(var j = 0; j < EnemyWave.length; j++)
        {
            if(this.hits(pShip))
            {
                this.Remove = true;
                this.Hit = true;
            }
        }
        //If they hit the bottom of the arena, go bye bye
        if(this.y > canvas.height)
        {
            this.Remove = true;
        }

        switch(this.flop)
        {
        case(1):
            this.x += delta * this.BetaX;
            break;
        case(2):
            this.x -= delta * this.BetaX;
            break;
        default:
            this.x += 0;
            break;
        }
        //Only shoot after TIMEFRAME
    }

    hits(object)
    {
        var vX = (this.x + (this.width / 2)) - (object.x + (object.width / 2));
        var vY = (this.y + (this.height / 2)) - (object.y + (object.height / 2));
        var hWidths = (this.width / 2) + (object.width / 2);
        var hHeights = (this.height / 2) + (object.height / 2);
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
        {
            return true
        }
        else
        {
            return false;
        }
        /*
        var d = dist(this, object)
        if(d < this.r + object.r)
        {
            return true
        }
        else
        {
            return false;
        }
        */
    }
}

class BasicEnemy
{
    constructor(x, y)
    {
            this.x = x;
            this.y = y;
            this.r = 13;
            this.hp = (10 + (wave * 3));
            this.speed = (25 + (wave * 1.25))
            this.sImage = new Image();
            this.sImage.src = "C R A B.png";
            this.Remove = false;
            this.hit = false;

            this.bump = getRandomNumber(1,2);
            this.AI = getRandomNumber(1,3);
    }

    render()
    {
		if(this.sImage.complete){
			this.width =  this.sImage.width;
            this.height = this.sImage.height;
			canvasContext.drawImage(this.sImage, this.x, this.y);
		}
    }

    update(delta)
    {
			if(this.sImage.complete){

            //If colision with bullet, go bye bye
            if(this.y < 75)
            {
                this.y += delta * this.speed;
            }
            if(this.y >= 75)
            {
                this.PickAI(this.AI, delta)
            }

            if(this.hp < 0 || this.y > canvas.height)
            {
                this.Remove = true;
            }
             //Only shoot after TIMEFRAME
            if(this.hits(pShip))
            {
                this.Remove = true;
                this.Hit = true;
            }
			}

    }

    hits(object)
    {
        var vX = (this.x + (this.width / 2)) - (object.x + (object.width / 2));
        var vY = (this.y + (this.height / 2)) - (object.y + (object.height / 2));
        var hWidths = (this.width / 2) + (object.width / 2);
        var hHeights = (this.height / 2) + (object.height / 2);
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
        {
            return true
        }
        else
        {
            return false;
        }
    }
    PickAI(Choice, delta)
    {
        switch(Choice) {
          case 1:
            this.BasicAI1(delta)
            break;
          case 2:
            this.BasicAI2(delta)
            break;
          case 3:
            this.BasicAI3(delta)
           break;
          default:
            BasicAI1(delta)
        }
    }


    BasicAI1(delta)
    {
        this.y += delta * this.speed;






    }
    BasicAI2(delta)
    {
        if(this.x < 5)
        {
            this.bump = 1;
        }
        if(this.x > canvas.width-40)
        {
            this.bump = 2;
        }
        this.y += delta * (this.speed);

        if(this.bump == 1)
        {
            this.x += delta * this.speed;
        }
        if(this.bump == 2)
        {
            this.x -= delta * this.speed;
        }

    }
    BasicAI3(delta)
    {
        if(this.x < 5)
        {
            this.bump = 1;
        }
        if(this.x > canvas.width - 40)
        {
            this.bump = 2;
        }


        if(this.bump == 1)
        {
            this.x += delta * this.speed;
            this.y += delta * (this.speed);
        }
        if(this.bump == 2)
        {
            this.x -= delta * this.speed;
        }
    }
}

class TankEnemy
{
    constructor(x, y,)
    {
            this.x = x;
            this.y = y;
            this.r = 13;
            this.hp = (55+ (wave * 5));
            this.speed = (23 + (wave * 1.25))
            this.sImage = new Image();
            this.sImage.src = "Rock.png";
            this.Remove = false;

            this.AI = getRandomNumber(1,3);
            this.test = false;
    }

    render()
    {
        if(this.sImage.complete)
        {
       	    this.width =  this.sImage.width;
            this.height = this.sImage.height;
       		canvasContext.drawImage(this.sImage, this.x, this.y);
       	}
    }

    update(delta)
    {

        if(this.y < 75)
        {
            this.y += delta * this.speed;
        }
        if(this.y >= 75)
        {
           this.PickAI(this.AI, delta)
        }

        if(this.hp < 0 || this.y > canvas.height)
        {
            this.Remove = true;
        }
        if(this.hits(pShip))
        {
            this.Remove = true;
            this.Hit = true;
        }
    }

    hits(object)
    {
        var vX = (this.x + (this.width / 2)) - (object.x + (object.width / 2));
        var vY = (this.y + (this.height / 2)) - (object.y + (object.height / 2));

        var hWidths = (this.width / 2) + (object.width / 2);
        var hHeights = (this.height / 2) + (object.height / 2);
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
        {
            return true
        }
        else
        {
            return false;
        }
    }

    PickAI(Choice, delta)
    {
        switch(Choice) {
          case 1:
            this.BasicAI1(delta)
            break;
          case 2:
            this.BasicAI2(delta)
            break;
          default:
            this.BasicAI1(delta)
        }
    }
    BasicAI1(delta)
    {
        this.y += delta * this.speed;


    }
    BasicAI2(delta)
    {
        this.y += delta * this.speed;

        for(var j = 0; j < EnemyWave.length; j++)
        {
            if(this.hits(EnemyWave[j]))
            {
                this.test = true
            }
        }

        if(this.test == false)
        {
            if(this.x > (pShip.x + 5))
            {
                this.x -= delta * this.speed;
            }
            else if(this.x < (pShip.x - 5))
            {
                this.x += delta * this.speed;
            }
        }
    }
}

class SpeedyEnemy
{
    constructor(x, y)
    {
            this.x = x;
            this.y = y;
            this.r = 16;
            this.hp = (4+ (wave * 2));
            this.speed = (120 + (wave * 1.45));
            this.sImage = new Image();
            this.sImage.src = "Octopus.png";


            this.Remove = false;

            this.bump = getRandomNumber(1,2);
            this.AI = getRandomNumber(1,2);
    }

    render()
    {
        if(this.sImage.complete)
        {
       	    this.width =  this.sImage.width;
            this.height = this.sImage.height;
       		canvasContext.drawImage(this.sImage, this.x, this.y);
       	}
    }

    hits(object)
    {
        var vX = (this.x + (this.width / 2)) - (object.x + (object.width / 2));
        var vY = (this.y + (this.height / 2)) - (object.y + (object.height / 2));

        var hWidths = (this.width / 2) + (object.width / 2);
        var hHeights = (this.height / 2) + (object.height / 2);
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
        {
            return true
        }
        else
        {
            return false;
        }
    }

    update(delta)
    {
            //If colision with bullet, go bye bye
            if(this.y < 75)
            {
                this.y += delta * this.speed;
            }
            if(this.y >= 75)
            {
                this.PickAI(this.AI, delta)
            }

            if(this.hp < 0 || this.y > canvas.height)
            {
                this.Remove = true;
            }
            if(this.hits(pShip))
            {
                this.Remove = true;
                this.Hit = true;
            }
    }

    PickAI(Choice, delta)
    {
        switch(Choice) {
          case 1:
            this.BasicAI1(delta)
            break;
          case 2:
            this.BasicAI2(delta)
            break;
           break;
          default:
            this.BasicAI1(delta)
        }
    }

    BasicAI1(delta)
    {
        this.y += delta * this.speed;

    }

    BasicAI2(delta)
    {
        if(this.x < 5)
        {
            this.bump = 1;
        }
        if(this.x > canvas.width - 40)
        {
            this.bump = 2;
        }
        this.y += delta * (this.speed);

        if(this.bump == 1)
        {
            this.x += delta * this.speed;
        }
        if(this.bump == 2)
        {
            this.x -= delta * this.speed;
        }

    }
}

class ShooterEnemy
{
    constructor(x, y)
    {
            this.x = x;
            this.y = y;
            this.r = 13;
            this.hp = (35 + (wave * 3));
            this.speed = (25 + (wave * 1.25));
            this.sImage = new Image();
            this.sImage.src = "Squod.png";

            this.Remove = false;
            this.Timer = new Date().getTime();

            this.bump = getRandomNumber(1,2);
            this.AI = getRandomNumber(1,3);
            this.ShootTimer = new Date().getTime() - this.Timer;
            this.ShootyShoot;
    }

    render()
    {
        if(this.sImage.complete)
        {
       	    this.width =  this.sImage.width;
            this.height = this.sImage.height;
       		canvasContext.drawImage(this.sImage, this.x, this.y);
       	}
    }

    update(delta)
    {
        this.ShootTimer = new Date().getTime() - this.Timer;
        if(this.y < 75)
        {
            this.y += delta * this.speed;
        }
        if(this.y >= 75)
        {
            this.PickAI(this.AI, delta)
        }
        if(this.hp < 0 || this.y > canvas.height)
        {
            this.Remove = true;
        }
        if(this.hits(pShip))
        {
            this.Remove = true;
            this.Hit = true;
        }
        if(this.ShootTimer>1750)
        {
            //Autofire?
            this.ShootyShoot = new EnemyBullet(this.x+15,this.y);
            eBullet.push(this.ShootyShoot);
            this.Timer = new Date().getTime();
        }


    }

    PickAI(Choice, delta)
    {
        switch(Choice) {
          case 1:
            this.BasicAI1(delta)
            break;
          case 2:
            this.BasicAI2(delta)
            break;
          default:
            this.BasicAI1(delta)
        }
    }

    hits(object)
    {
        var vX = (this.x + (this.width / 2)) - (object.x + (object.width / 2));
        var vY = (this.y + (this.height / 2)) - (object.y + (object.height / 2));

        var hWidths = (this.width / 2) + (object.width / 2);
        var hHeights = (this.height / 2) + (object.height / 2);
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
        {
            return true
        }
        else
        {
            return false;
        }
    }

    BasicAI1(delta)
    {
        if(this.x < 0)
        {
            this.bump = 1;
        }
        if(this.x > canvas.width - 40)
        {
            this.bump = 2;
        }
        if(this.bump == 1)
        {
            this.x += delta * (this.speed+100);
        }
        if(this.bump == 2)
        {
            this.x -= delta * (this.speed+100);
        }

    }
    BasicAI2(delta)
    {

        if(this.x < 5)
        {
            this.bump = 1;
        }
        if(this.x > canvas.width - 40)
        {
            this.bump = 2;
        }
        this.y += delta * (this.speed);

        if(this.bump == 1)
        {
            this.x += delta * (this.speed+100);
        }
        if(this.bump == 2)
        {
            this.x -= delta * (this.speed+100);
        }

    }
}

class BonusEnemy
{
    constructor(x, y)
    {
            this.x = x;
            this.y = y;
            this.r = 13;
            this.hp = (1);
            this.speed = (25 + (wave));
            this.sImage = new Image();
            this.sImage.src = "LittleShtAtTheBack.png";

            this.Remove = false;

            this.bump = getRandomNumber(1,2);
    }

    render()
    {
        if(this.sImage.complete)
        {
       	    this.width =  this.sImage.width;
            this.height = this.sImage.height;
       		canvasContext.drawImage(this.sImage, this.x, this.y);
       	}
    }

    update(delta)
    {
          if(this.y < 75)
          {
              this.y += delta * this.speed;
          }
          if(this.y >= 75)
          {
              this.BasicAI1(delta);
          }

          if(this.hp < 0 || this.y > canvas.height)
          {
              this.Remove = true;
          }
    }

    hits(object)
    {
        var vX = (this.x + (this.width / 2)) - (object.x + (object.width / 2));
        var vY = (this.y + (this.height / 2)) - (object.y + (object.height / 2));

        var hWidths = (this.width / 2) + (object.width / 2);
        var hHeights = (this.height / 2) + (object.height / 2);
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
        {
            return true
        }
        else
        {
            return false;
        }
    }



    BasicAI1(delta)
    {
        if(this.x < 5)
        {
            this.bump = 1;
        }
        if(this.x > canvas.width - 40)
        {
            this.bump = 2;
        }
            if(this.bump == 1)
        {
        this.x += delta * (this.speed+100);
        }
            if(this.bump == 2)
        {
            this.x -= delta * (this.speed+100);
        }

    }
}

class BossEnemy
{
    constructor(x, y)
    {
            this.x = x;
            this.y = y;
            this.r = 16;
            this.hp = (750 + (wave * 20));
            this.speed = (25 + (wave * 2));
            this.bullets = (3 + (wave/5))
            this.sImage = new Image();
            this.sImage.src = "Whale2.png";
            this.Remove = false;

            this.AI = getRandomNumber(1,3);
            this.bump = getRandomNumber(1,2);
            this.JumpY = 1;
            this.TimerC = new Date().getTime();
            this.SpawnTimer = new Date().getTime() - this.TimerC;
    }

    render()
    {
        if(this.sImage.complete)
        {
       	    this.width =  this.sImage.width;
            this.height = this.sImage.height;
       		canvasContext.drawImage(this.sImage, this.x, this.y);
       	}
    }

    update(delta)
    {
          this.SpawnTimer = new Date().getTime() - this.TimerC;
          if(this.y < 75)
          {
              this.y += delta * this.speed;
          }
          if(this.y >= 75)
          {
              this.PickAI(this.AI, delta)
          }
          if(this.hp < 0 || this.y > canvas.height)
          {
             this.Remove = true;
          }
          if((this.SpawnTimer>5000))
          {
             //Autofire?
             this.ShootyShoot = new ShooterEnemy(this.x+159,this.y+200);
             EnemyWave.push(this.ShootyShoot);
             for(var i = 0; i < this.bullets; i++)
             {
                var e = new EnemyBullet(this.x+159,this.y+200,getRandomNumber(50,150),getRandomNumber(1,2))
                eBullet.push(e);
             }
             //Spawn bullets,
             //Add random velocities
             this.TimerC = new Date().getTime();
          }
          if(this.hits(pShip))
          {
                lives -= 999
          }
    }

    hits(object)
    {
        var vX = (this.x + (this.width / 2)) - (object.x + (object.width / 2));
        var vY = (this.y + (this.height / 2)) - (object.y + (object.height / 2));

        var hWidths = (this.width / 2) + (object.width / 2);
        var hHeights = (this.height / 2) + (object.height / 2);
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)
        {
            return true
        }
        else
        {
            return false;
        }
    }

    PickAI(Choice, delta)
    {
        switch(Choice) {
          case 1:
            this.BossAI(delta)
            break;
          case 2:
            this.BossAI2(delta)
            break;
          case 3:
            this.BossAI3(delta)
            break;
          default:
            this.BasicAI1(delta)
        }
    }

    BossAI(delta)
    {
        if(this.x < 0 - (this.width/3))
        {
            this.bump = 1;
        }
        if(this.x > (canvas.width - this.width/3))
        {
            this.bump = 2;
        }
        if(this.bump == 1)
        {
        this.x += delta * (this.speed+100);
        }
            if(this.bump == 2)
        {
            this.x -= delta * (this.speed+100);
        }

        //Shooty bullets somewhat.
    }

    BossAI2(delta)
    {
        if(this.x > canvas.width)
        {
           this.x = (0 - this.width);
        }
        this.x += delta * (this.speed+100);
    }

    BossAI3(delta)
    {
        if(this.x < -250)
        {
           this.x = (canvas.width);
        }
        this.x -= delta * (this.speed+100);
    }
}

class MenuButton
{
    constructor(x, y, imageButton)
    {
            this.x = x;
            this.y = y;
            this.sImage = new Image();
            this.sImage.src = imageButton
    }

    render()
    {
		if(this.sImage.complete){
			this.width =  this.sImage.width;
            this.height = this.sImage.height;
			canvasContext.drawImage(this.sImage, this.x, this.y);
		}
    }

    update(delta)
    {

    }
}

class ExploEffect
{
    constructor(x, y, SWidth, SHeight)
    {
            this.x = x;
            this.y = y;
            this.sImage = new Image();
            this.sImage.src = "Explosion.png";
            this.width =  SWidth;
            this.height = SHeight;
            this.Remove = false;
            //animation
            this.frameX = 0
            this.startTimeMS = 0;
            this.frameXMax = 2;
            this.frameY = 0;
            this.frameYMax = 3;
            this.frame = 0;
            this.frameMax = 11;
            this.frameTimer = 0.05;
            this.frameTimeMax = 0.051;
            this.spriteWidth = 32;
            this.spriteHeight = 32;
            //width:128  Height:96
    }

    render(delta)
    {
           this.animationFrame(delta)
            //canvasContext.drawImage(this.sImage, this.x, this.y);
           canvasContext.drawImage(this.sImage, this.spriteWidth*this.frameX, this.spriteHeight*this.frameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }

    update(delta)
    {

    }

    animationFrame(delta)
    {

    	//only update frames when timer is below 0
    	this.frameTimer = this.frameTimer - delta;
    	if(this.frameTimer <= 0)
    	{
    	    this.frameTimer = this.frameTimeMax;
    		this.frameX++;
    		if(this.frameX>this.frameXMax)
    		{
    	        this.frameX = 0;
    			this.frameY++;
    			//end of row, move down to next row in sheet
    			if(this.frameY>this.frameYMax)
    			{
    		        this.frameY = 0;
    			}
    		}
    		this.frame++;
    		//reset frames to 0 in event that there are empty spaces on sprite sheet
    		if(this.frame > this.frameMax)
    		{
    		    this.frame = 0;
    			this.frameX = 0;
    			this.frameY = 0;
    			this.Remove = true;
    		}
    	}
    }

}
//canvas
var canvas;
var canvasContext;
var canvasX;
var canvasY;
//Controls
var mouseIsDown = 0;
var lastPt=null;
var keys = [];
var ShipMove = 0;
var controlX = 0;
var controlY = 0;
//wave definition
var wave = 0;
var bossSpawn = 5;
var upgradeSpawn = 3;
var SpawnNumber;
//sprite control
var bkgdImage;
var travel = 0;
var pShip;
var pBullet = [];
var eBullet = [];
var EnemyWave = [];
var UpgradeButtons = [];
var Explosions = [];
var Upgrades = false;
//Menu control
var gameOverScreen = false;
var Pause = false;
var lives = 3;
//timers
var startTimeMS;
var attacktimer;
//Menu code
var buttonX = [100,220]
var	buttonY = [100,100]
var buttonWidth = [88,88]
var buttonHeight = [88,88]
//buttons
var mouseX;
var MouseY;
var playImage = new Image();
var quit = new Image();
var background = new Image();
var buttonClicked = 0;
//Buttons accual
var button1;
var button2;
var button3;
var button4;
var button5;
var buttonPlay;
var buttonexit;
var buttonPause;
//Music
var menuMusicPlaying = false;
var myMusic = new Audio('music.mp3');
var EnemyBoom = new Audio("EnemyBoom.wav");
var PlayerOof = new Audio("PlayerHurt.wav");
var GameOver = new Audio("GameOver.wav");
var BossOof = new Audio("BossHurt.wav");
var PwrUp = new Audio("PowerUp.wav")
//window.onload =
function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    init();
    showMenu();
    //initgame();

}

function init()
{
    canvas.width = 425;
    canvas.height = 800;
}

function initgame()
{
    if (canvas.getContext)
    {
        //Set Event Listeners for window, mouse and touch
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);
        window.addEventListener("load", function () { init(); showMenu();});

        	document.body.addEventListener("keydown", function (e) {
        		keys[e.keyCode] = true;
        		isKeyPressed = true;
        	});
        	document.body.addEventListener("keyup", function (e)
        	{
        		keys[e.keyCode] = false;
        		isKeyPressed = false;
        	});


        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", FingeMove, true);
        canvas.addEventListener("touchend", touchUp, false);

        //canvas.addEventListener("click", touchXY, false);

        canvas.addEventListener("mousedown", touchDown, false);
        addEventListener('mousemove', FingeMove, false);
        canvas.addEventListener("mouseup", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);
        //resizeCanvas();
        bkgdImage = new Background(0,0,"AAAAASpaceTest.jpg", 15, 0, "Generic"); //Background
        pShip = new PlayerShip(25,canvas.height - 100, "AAASpaceTest.jpg"); //Player
        startTimeMS = Date.now();
        //Timers
        TimerA = new Date().getTime();
        //buttons set up
        button1 = new MenuButton(50,280, "Damage.png"); UpgradeButtons.push(button1);
        button2 = new MenuButton(50,380, "AttackSpeed.png"); UpgradeButtons.push(button2);
        button3 = new MenuButton(50,480, "Accuracy.png"); UpgradeButtons.push(button3);
        button4 = new MenuButton(50,580, "Bullets.png"); UpgradeButtons.push(button4);
        button5 = new MenuButton(50,680, "Speed.png");UpgradeButtons.push(button5);

        buttonPlay = new MenuButton(100,canvas.height/3,"play.png");
        buttonexit = new MenuButton(100,canvas.height/1.5,"Exit.png")
        buttonPause = new MenuButton(canvas.width-40, 5, "Pause.gif" )

        gameLoop();
    }
}

function resizeCanvas()
{
    canvas.width = 425;
    canvas.height = 800;
    //window.innerWidth;
    //window.innerHeight;
}

function gameLoop()
{
    if(!gameOverScreen)
    {
        if(!menuMusicPlaying)
        {
            menuMusicPlaying = true;
        	myMusic.volume = 1;
        	myMusic.loop = true;
        	myMusic.load()
        	myMusic.play();
        }
        //console.log(Pause)
        var elapsed = (Date.now() - startTimeMS)/1000;
        update(elapsed);
        render(elapsed);
        startTimeMS = Date.now();
        requestAnimationFrame(gameLoop);
    }
    else if(gameOverScreen)
    {
        renderendscreen()
        requestAnimationFrame(gameLoop);
    }
}
function update(delta)
{
    if(lives <= 0)
    {
        GameOver.play();
        menuMusicPlaying = false;
        myMusic.pause();
        gameOverScreen = true;
    }
    SpawnWave();
    var elapsed = (Date.now() - startTimeMS)/1000;
    travel += elapsed * bkgdImage.vx;
    if (travel > bkgdImage.sImage.height)
    {
        travel = 0;
    }
    if(Upgrades == false && Pause == false)
    {
        //Update everything with wave spawning
        for(var i = pBullet.length-1; i >= 0; i--)
        {
            pBullet[i].update(delta);
            if(pBullet[i].Remove)
            {
                pBullet.splice(i,1);
            }
        }
        for(var i = EnemyWave.length-1; i >=0 ; i--)
        {
            EnemyWave[i].update(delta)
            if(EnemyWave[i].Remove)
            {
                var Kaboom = new ExploEffect(EnemyWave[i].x,EnemyWave[i].y,EnemyWave[i].width,EnemyWave[i].height);
                Explosions.push(Kaboom);
                if(EnemyWave[i].Hit)
                {
                    lives -=1;
                }
                EnemyBoom.play();
                EnemyWave.splice(i,1);
            }
        }
        for(var i = eBullet.length-1; i >=0 ; i--)
        {
            eBullet[i].update(delta)
            if(eBullet[i].Remove)
            {
                if(eBullet[i].Hit)
                {
                    lives--;
                    PlayerOof.play();
                }
                eBullet.splice(i,1);
            }
        }
        pShip.update(delta);
    }
    for(var i = Explosions.length-1; i >=0 ; i--)
    {
        Explosions[i].update(delta)
        if(Explosions[i].Remove)
        {
            Explosions.splice(i,1);
        }
    }
}
function render(delta)
{
   canvasContext.clearRect(10, 10, canvas.width, canvas.height);
   bkgdImage.scrollBK(travel);
   pShip.render();
   //RenderLoop
   for(var i = 0; i < pBullet.length; i++)
   {
        pBullet[i].render();
   }
   for(var i = 0; i < EnemyWave.length; i++)
   {
        var bump = bosspush()
        if((EnemyWave[i].y) > (0 - bump) )
        {
            EnemyWave[i].render();
        }
   }
   for(var i = 0; i < eBullet.length; i++)
   {
        eBullet[i].render();
   }
   for(var i = 0; i < Explosions.length; i++)
   {
        Explosions[i].render(delta);
   }
   if(Upgrades == true)
   {
       //Upgrade screen
       canvasContext.fillStyle = "#000000";
       canvasContext.fillRect(20,200,canvas.width,canvas.height/1.4 );
       canvasContext.font = "30px Arial";
       canvasContext.fillStyle = "#ff0000";
       canvasContext.fillText("Pick an upgrade!" , 100,240);
       canvasContext.font = "22px Arial";
       //Text for the upgrades (Yikes)
       canvasContext.fillText("+20 Damage",160,300);
       canvasContext.fillText("Current damage: " +pShip.damage + ".",160,330);
       canvasContext.fillText("-25 fire rate delay",160,400);
       canvasContext.fillText("Current delay: "+pShip.AttackSpeed + ". Max 100",160,430);
       canvasContext.fillText("+25 Increased Acc.",160,500);
       canvasContext.fillText("Current: " +pShip.accuracy+ ". Max: 25",160,530);
       canvasContext.fillText("+1 Extra Bullets",160,600);
       canvasContext.fillText("Current: "+pShip.BulletNumber+". Max 20",160,630);
       canvasContext.fillText("+50 Movement speed",160,700);
       canvasContext.fillText("Current: "+pShip.speed+". Max 500",160,730);
       for(var i = 0; i < UpgradeButtons.length; i++)
       {
            UpgradeButtons[i].render();
       }

   }
   if(Pause == true)
   {
       //pause menu
       canvasContext.fillStyle = "#000000";
       canvasContext.fillRect(30,200,canvas.width/1.2,100 );
       canvasContext.fillStyle = "#ff0000";
       canvasContext.fillText("PAUSED" ,canvas.width/2-75,240);
   }
      //UI
      canvasContext.fillStyle = "#000000";
      canvasContext.fillRect(0,0,canvas.width,30);
      canvasContext.font = "30px Arial";
      canvasContext.fillStyle = "#ff0000";
      canvasContext.fillText("Lives: " +lives ,10 ,25);
      canvasContext.fillText("Wave Number: " +wave, 150, 25)
      buttonPause.render();
}


function SpawnWave()
{
    if(EnemyWave.length == 0)
    {
        wave++; //Update wave
        SpawnNumber = 0;
        if(wave == upgradeSpawn) //If its a multiple of three, upgrade
        {
            Upgrades = true;
            upgradeSpawn += 3;
        }

        if(wave == bossSpawn) //If boss fight
        {
            EnemyWave[0] = new BossEnemy(((canvas.width/2)-153), (0-170));
            if(lives < 3)
            {
                lives++;
            }
            bossSpawn +=5;
        }
        else //Not a boss fight
        {
            for(var y = 0; y < (wave/3); y++) //Every 3 waves add a new layer
            {
                for(var x = 0; x < 8; x++) // 8 in a wave
                {
                    //EnemyWave[x] = new ShooterEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                    ChanceRates(x,y,SpawnNumber);
                }
            }
        }
    }

}
function ChanceRates(x,y,z)
{
    //Some borrning math shit here
    //EnemyWave[z] = new BasicEnemy((x*120)+60,25 -(y*45));
    //EnemyWave[z] = new TankEnemy((x*120)+60,25 -(y*45));
    //EnemyWave[z] = new SpeedyEnemy((x*120)+60,25 -(y*45))
    var dospawn = getRandomNumber(1,100);
    //EnemyWave[z] = new BasicEnemy((canvas.width/8)+(x), 25 -(y*45));
    //EnemyWave[z] = new BasicEnemy((x*120)+60, 25 -(y*45));
    if(y == 0)
    {
        if(wave > 2 && wave < 5)
        {
            if(dospawn < 10 + (Math.min(wave*5,55)))
            {
                EnemyWave[z] = new TankEnemy(5 + (x*(canvas.width/8)) , 0 - (y*45));
                SpawnNumber++;
            }
            else
            {

                EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }

        }
        else if(wave > 4)
        {
            if(dospawn < 10 + (Math.min(wave*5,55)))
            {
                EnemyWave[z] = new TankEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }else if(dospawn > 55  && dospawn < 55 + (Math.min(wave*5,25)))
            {
                EnemyWave[z] = new SpeedyEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45))
                SpawnNumber++;
            }else
            {
                EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }

        }
        else
        {
             EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45))
             SpawnNumber++;
        }

    }
    else if(y > 2 && y == (Math.floor(wave/3)))
    {
        if(wave > 2 && wave < 5)
        {
            if(dospawn <= 1 + (Math.min(wave,15)))
            {
                EnemyWave[z] = new BonusEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }
            else
            {
                EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }

        }
        else if(wave > 4)
        {
            if(dospawn <= 1 + (Math.min(wave,15)))
            {
                EnemyWave[z] = new BonusEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }else if(dospawn > 15  && dospawn < 15 + (Math.min(wave*5,100)))
            {
                EnemyWave[z] = new ShooterEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45))
                SpawnNumber++;
            }else
            {
                EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }

        }
    }
    else
    {
        if(wave > 2 && wave < 5)
        {
            if(dospawn <= 10 + (Math.min(wave,25)))
            {
                EnemyWave[z] = new TankEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }
            else
            {
                EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }

        }
        else if(wave > 5 && wave <= 8)
        {
            if(dospawn <= 1 + (Math.min(wave,25)))
            {
                EnemyWave[z] = new TankEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }else if(dospawn > 25  && dospawn < 35 + (Math.min(wave*2,60)))
            {
                EnemyWave[z] = new ShooterEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45))
                SpawnNumber++;
            }else
            {
                EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }

        }
        else if(wave >= 9)
        {
            if(dospawn <= 1 + (Math.min(wave,25)))
            {
                EnemyWave[z] = new TankEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }else if(dospawn > 25  && dospawn < 35 + (Math.min(wave*5,60)))
            {
                EnemyWave[z] = new ShooterEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45))
                SpawnNumber++;
            }else if(dospawn > 35 + (Math.min(wave*5,60))  && dospawn < 45 + (Math.min(wave*5,100)))
            {
                EnemyWave[z] = new SpeedyEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45))
                SpawnNumber++;
            }else
            {

                EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
                SpawnNumber++;
            }
        }
        else
        {
            EnemyWave[z] = new BasicEnemy(5 + (x*(canvas.width/8)) , 0 -(y*45));
            SpawnNumber++;
        }
    }
    /*
        Wave 3+ – Tank mob, replacement for basic mob (10%, +5% per wave) max 55%
        Wave 5+ – Zoomies Replacement for basic mob (5%, +5% per wave) Max 25%
    /*
        MID WAVE
        Wave 3+ - Tank mob 10%(+1% max 25%)
        Wave 6+ Shooter 10% (2% max 35%)
        Wave 9+ Zoomier 10% (2% max 40%)

        BACK WAVE
        Wave 3+ - Little **** at the back (1% + 0.5 per wave) Max 10%
        Wave 6+ - Shooter 25% (+5% per wave) Max 75%
    */



}

function touchUp(evt)
{
    evt.preventDefault();
    // Terminate touch path
    lastPt=null;
    mouseIsDown = 0;
    console.log("UP!")
}

function touchDown(evt)
{
    evt.preventDefault();
    touchXY(evt);
    mouseIsDown = 1;
    console.log("DOWN")

        /*
        if(touchY > pShip.y)
        {
            travel[1] = 1;
            pShip.y+= delta * pShip.speed;
        }
        if(touchY < pShip.y)
        {
            travel[1] = 2;
            pShip.y -= delta * pShip.speed;
        }
        */
}

function touchXY(evt)
{
     evt.preventDefault();
     if(lastPt != null)
     {
        var touchX = evt.pageX - canvas.offsetLeft;
        var touchY = evt.pageY - canvas.offsetTop;
     }
             if(touchX > pShip.x)
             {
                    pShip.x +=10;
                    ShipMove = 1;
                    //pShip.x+= delta * pShip.speed;
             }
             if(touchX < pShip.x)
             {
                    ShipMove = 2;
                    //pShip.x -= delta * pShip.speed;
             }
}

function FingeMove(evt)
{
      evt.preventDefault();
      var obj_left = 0;
      var obj_top = 0;
      if (canvas.offsetParent)
      {
        obj_left += canvas.offsetLeft;
        obj_top += canvas.offsetTop;
        obj = canvas.offsetParent;
      }
        //FireFox
      controlX = evt.pageX - obj_left;
      controlY = evt.pageY - obj_top;


}

function getRandomNumber(min, max)
{
	    var Yikers = Math.round(((Math.random() * ((max) - min)) + min));
	    return Yikers;
}


function renderendscreen()
{
   canvasContext.clearRect(10, 10, canvas.width, canvas.height);
   bkgdImage.scrollBK(travel);
   canvasContext.fillStyle = "#ff0000";
   canvasContext.fillText("You died at wave: " +wave+ "." ,80 ,100);

   canvasContext.fillText("Play again?: ",130, 150)
   buttonPlay.render();
   buttonexit.render();
}
function bosspush()
{
    if(wave+5 ==  bossSpawn)
    {
        return 256;
    }
    else
    {
        return 32;
    }
}

function showMenu()
{
    //Setting the sprites
    background.src = "AAAAASpaceTest.jpg"
	playImage.src = "play.png"
    quit.src = "Exit.png"
	background.addEventListener("load", e => {
		//Load in the text in the same area
		canvasContext.drawImage(background, 0,0,1000,1000);
		canvasContext.drawImage(playImage, buttonX[0],buttonY[0],buttonWidth[0],buttonHeight[0]);
        canvasContext.drawImage(quit, buttonX[1],buttonY[1],buttonWidth[1],buttonHeight[1]);
		canvasContext.font = "30px STHupo";
        canvasContext.fillStyle = "#000000";
        canvasContext.fillRect(20,canvas.height/2,canvas.width/1.07,canvas.height/2.5 ); //Instruct box
        canvasContext.fillStyle = "#dbdbdb";
        canvasContext.fillText("Perpetual Space War " , canvas.width/2 - 120 ,50);
        canvasContext.font = "30px Forte";
        canvasContext.fillStyle = "#ff0000";
        canvasContext.fillText("How to play!" ,canvas.width/2-90,canvas.height/2+50);
        canvasContext.font = "18px Arial";
        canvasContext.fillStyle = "#dbdbdb";
        canvasContext.fillText("You shoot full-auto, The ship follows your finger."  ,25,canvas.height/2+100);
        canvasContext.fillText("Every three waves you get an upgrade." ,25,canvas.height/2+125);
        canvasContext.fillText("Every 5 waves prepare for a boss fight!" ,25,canvas.height/2+150);
        canvasContext.fillText("The enimies never stop comming," ,25,canvas.height/2+175);
        canvasContext.fillText("and never stop improving..." ,25,canvas.height/2+200);
        canvasContext.font = "32px Arial";
        canvasContext.fillText("How far can you go!?" ,75,canvas.height/2+270);
    });

	canvas.addEventListener("mousemove", checkPos);
	canvas.addEventListener("mouseup", checkClick);


}
function checkPos(event)
{
    coords = canvas.relMouseCoords(event);
    mouseX = coords.x;
    mouseY = coords.y;
}
function checkClick(mouseEvent)
{
	if(buttonClicked == 0)
	{
		if(mouseX > buttonX[0] && mouseX < (buttonX[0] + buttonWidth[0])){
			if(mouseY > buttonY[0] && mouseY < (buttonY[0] + buttonHeight[0])){
				buttonClicked = 1;
				initgame();
			}

		}
		if(mouseX > buttonX[1] && mouseX < (buttonX[1] + buttonWidth[1])){
			if(mouseY > buttonY[1] && mouseY < (buttonY[1] + buttonHeight[1])){
				console.log("byebye")
			}

		}
	}
    //cap upgrades.
    if(Upgrades == true)
    {
	    PwrUp.volume = 1;
	    if(mouseX > button1.x && mouseX < (button1.x + button1.width)){
            if(mouseY > button1.y && mouseY < (button1.y + button1.height)){
			    pShip.Damage += 10;
			    PwrUp.play();
			    Upgrades = false;
		    }
        }
        if(mouseX > button2.x && mouseX < (button2.x + button2.width)){
            if(mouseY > button2.y && mouseY < (button2.y + button2.height)){
			    if(pShip.AttackSpeed > 90)
			    {
			        pShip.AttackSpeed -=50;
			        PwrUp.play();
                    Upgrades = false;
			    }

		    }
        }
        if(mouseX > button3.x && mouseX < (button3.x + button3.width)){
            if(mouseY > button3.y && mouseY < (button3.y + button3.height)){
                if(pShip.accuracy > 45)
			    {
			        pShip.accuracy -=25;
			        PwrUp.play();
			        Upgrades = false;
			    }

		    }
        }
        if(mouseX > button4.x && mouseX < (button4.x + button4.width)){
            if(mouseY > button4.y && mouseY < (button4.y + button4.height)){
			    if(pShip.BulletNumber < 19)
			    {
			        pShip.BulletNumber +=1;
			        PwrUp.play();
                    Upgrades = false;
			    }

		    }
        }
        if(mouseX > button5.x && mouseX < (button5.x + button5.width)){
            if(mouseY > button5.y && mouseY < (button5.y + button5.height)){
                if(pShip.speed < 460)
			    {
                    pShip.speed += 50;
                    PwrUp.play();
			        Upgrades = false;
			    }
		    }
        }
    }

    if(gameOverScreen == true)
    {
        if(mouseX > buttonexit.x && mouseX < (buttonexit.x + buttonexit.width)){
            if(mouseY > buttonexit.y && mouseY < (buttonexit.y + buttonexit.height)){
                console.log("Heyo exit the game")
		    }
        }
        if(mouseX > buttonPlay.x && mouseX < (buttonPlay.x + buttonPlay.width)){
            if(mouseY > buttonPlay.y && mouseY < (buttonPlay.y + buttonPlay.height)){
                //Resart the game
		        wave = 0;
		        lives = 3;
		        bossSpawn = 5;
                upgradeSpawn = 3;
                pBullet = [];
                eBullet = [];
                EnemyWave = [];
                gameOverScreen = false;
                initgame();
		    }
        }
    }
        if(mouseX > buttonPause.x && mouseX < (buttonPause.x + buttonPause.width)){
            if(mouseY > buttonPause.y && mouseY < (buttonPause.y + buttonPause.height)){
			    console.log("Pressing")
			    Pause = !Pause;
		    }
        }
		/*
		if(buttonClicked>0){
			canvas.removeEventListener("mousemove",checkPos);
			canvas.removeEventListener("mouseup",checkClick);
		}
        */
}
HTMLCanvasElement.prototype.relMouseCoords = function (event)
{
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var canvasX = 0;
		var canvasY = 0;
		var currentElelement = this;

		do {
			totalOffsetX += currentElelement.offsetLeft;
			totalOffsetY += currentElelement.offsetTop;
		}
		while (currentElelement = currentElelement.offsetParent)

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		//Fix for varibles
		canvasX = Math.round(canvasX *(this.width / this.offsetWidth));
		canvasY = Math.round(canvasY *(this.height / this.offsetHeight));
		return {x:canvasX, y:canvasY}
}
