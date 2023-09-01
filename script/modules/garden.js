import Plant from "./plant.js";
import AppSound from "./appSound.js";

export default class Garden {
    constructor(root, soundToggleElem, imagesPath, containerClassName, maxCanLitres, maxCloudLitres) {
        this.soundToggleElem = soundToggleElem;
        this.soundAllowed = false;
        this.root = root;
        this.imagesPath = imagesPath;
        this.sounds = [];
        this.plants = [];
        this.fruits = [];
        this.baskets = [];
        this.isRaining = false;
        this.isCanTaken = false;
        this.isPointerOnStation = true;
        this.isCanWatering = false;
        this.targetPlant = null;
        this.maxCanLitres = maxCanLitres;
        this.maxCloudLitres = maxCloudLitres;
        this.canLitres = this.maxCanLitres;
        this.cloudLitres = this.maxCloudLitres;
        this.draggedFruit = null;
        this.addContainer(containerClassName);
        this.addSoundToggleListener();
    }

    addSoundToggleListener(){
        this.soundToggleElem.addEventListener('click', () => {
            this.soundAllowed = !this.soundAllowed;
            this.soundToggleElem.classList.toggle('allow');
        })
    }

    addContainer(containerClassName){
        const container = document.createElement('div');
        container.classList.add(containerClassName);
        this.container = container;
        this.root.append(this.container);
    }

    removeContainer(){
        this.container.remove();
    }

    makeTransparentBg(){
        this.container.style.backgroundColor = 'transparent';
        this.container.style.backgroundImage = 'none';
    }

    async setNewView(containerClassName, timeToSwing) {
        if(this.container){
            if(timeToSwing){
                await this.changeStyleValueGradually(
                    this.container, 
                    timeToSwing, 
                    (elem, value)=> {elem.style.opacity = `${1-value}`}, 1);
            }
            this.removeContainer();
        }
        this.addContainer(containerClassName);
            if(timeToSwing) {
                this.container.style.opacity = '0';
                await this.changeStyleValueGradually(
                    this.container, 
                    timeToSwing, 
                    (elem, value)=> elem.style.opacity = `${value}`, 1 );
            }
    }

    changeStyleValueGradually(elem, msAnimationTime, callbackToStyleElem, maxValue){
        return new Promise((resolve, reject) => {
            let start, previousTimeStamp;
            let done = false;
            const msCoefficient = maxValue / msAnimationTime;

            function step(timeStamp) {
                if (start === undefined) {
                    start = timeStamp;
                }
                const elapsed = timeStamp - start;

                if (previousTimeStamp !== timeStamp) {
                    // Math.min() is used here to make sure the element stops at exactly 200px
                    const count = Math.min(msCoefficient * elapsed, maxValue);
                    callbackToStyleElem(elem, count)
                    //element.style.transform = `translateX(${count}px)`;
                    if (count === maxValue) {
                        done = true;
                        resolve();
                    }
                }

                if (elapsed < msAnimationTime) {
                    // Stop the animation after 2 seconds
                    previousTimeStamp = timeStamp;
                    if (!done) {
                    window.requestAnimationFrame(step);
                    }
                }
            }
            window.requestAnimationFrame(step);
        })   
    }



    createCloud(cloudImageFileName, rainImageFileName) {
        const cloudWrapper = document.createElement('div');
        cloudWrapper.classList.add('cloud-wrapper');
        const cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.style.backgroundImage = `url('${this.imagesPath}${cloudImageFileName}')`;
        const rain = document.createElement('div');
        rain.classList.add('rain');
        rain.style.backgroundImage = `url('${this.imagesPath}${rainImageFileName}')`;
        rain.style.display = 'none';
        cloudWrapper.append(cloud, rain);

        this.cloudWrapper = cloudWrapper;
        this.cloud = cloud;
        this.rain = rain;
    }

    addCloud(container, delay, positionParams) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                container.append(this.cloudWrapper);
                for (let param of Object.keys(positionParams)) {
                    this.cloudWrapper.style[param] = positionParams[param];
                }
                resolve();
            }, delay);
        })
       
    }

    removeCloud() {
        this.cloudWrapper.remove();
    }

    createCan() {
        const can = document.createElement('div');
        can.style.backgroundImage = `url('${this.imagesPath}watering-can_stand.png')`;
        can.classList.add('watering-can');
        const splashes = document.createElement('div');
        splashes.classList.add('splashes');

        can.append(splashes);
        this.can = can;
        this.splashes = splashes;
        this.splashes.style.display = 'none';

    }

    addCan(container, delay, positionParams) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                container.append(this.can);
                for (let param of Object.keys(positionParams)) {
                    this.can.style[param] = positionParams[param];
                }
                this.setCanStationCoords();
                resolve();
            }, delay)
        })  
    }

    setCanStationCoords(){
        if(!this.isCanTaken){
            const {top, left, right, bottom} = this.can.getBoundingClientRect();
            this.stationLeft = this.can.offsetLeft;
            this.stationRight = this.can.offsetLeft + this.can.offsetWidth;
            this.stationTop = this.can.offsetTop;
            this.stationBottom = this.can.offsetTop + this.can.offsetHeight;
        }
    }

    createCanInfo() {
        const canInfo = document.createElement('div');
        canInfo.classList.add('can-info');
        canInfo.innerHTML = `Водa: <span data-rest></span>/<span data-total></span>л`;
        this.canInfo = canInfo
    }

    addCanInfo(container, delay, positionParams) {
        return new Promise((resolve, reject) => {
            setTimeout(()=> {
                container.append(this.canInfo);
                for (let param of Object.keys(positionParams)) {
                    this.canInfo.style[param] = positionParams[param];
                }
                resolve();
            }, delay)
        })
        
    }

    updateCanInfo() {
        this.canInfo.querySelector('[data-rest]').textContent = this.canLitres;
        this.canInfo.querySelector('[data-total]').textContent = this.maxCanLitres;
    }

    createInformator(imageFileName) {
        const informator = document.createElement('div');
        informator.classList.add('informator');
        const informatorInner = `
        <div class='informator_avatar'>
            <img src='${this.imagesPath}${imageFileName}' alt=''>
        </div>
        <div class="informator_text">
            <div class="informator_text-wrapper"></div>
        </div>
        `;      
        informator.innerHTML = informatorInner;
        this.informator = informator; 
    }

    addInformator() {
        this.container.style.position = 'relative';
        this.container.append(this.informator);
    }

    placeInfomator(positionParams={}) { 
        this.informator.style = ''
        this.informator.style.position = 'absolute';
        for (let param of Object.keys(positionParams)) {
            this.informator.style[param] = positionParams[param];
        }
    }

    removeInformator() {
        this.informator.remove();
    }

    addSelfRemovingTrigger(text, callback, container) {
        const trigger = document.createElement('button');
        trigger.textContent = text;
        trigger.classList.add('informator_btn');
        container.insertAdjacentElement('beforeend', trigger);
        trigger.addEventListener('click', () => {
            removeEventListener('click', callback);
            setTimeout(() => {
                trigger.remove();
                callback();
            }, 500)
            
        })
    }

    savePlant(plantInstance) {
        if (plantInstance instanceof Plant) {
            this.plants.push(plantInstance);
        }  
    }

    async addPlants(interval) {
        return new Promise( (resolve, reject) => {
            this.plants.forEach(async(plant, i)=> {
                await plant.placeWithDelay(plant.pot, this.container, interval, i);
                if(i === this.plants.length -1) {
                    resolve();
                }
            })
        })       
    }

    async addBaskets(interval) {
        return new Promise( (resolve, reject) => {
            this.plants.forEach(async(plant, i)=> {
                await plant.placeWithDelay(plant.basket, this.container, interval, i);
                if(i === this.plants.length -1) {
                    resolve();
                }
            })
        })       
    }

    createFruitContainer() {
        const fruitContainer = document.createElement('div');
        fruitContainer.classList.add('fruit-container');
        this.fruitContainer = fruitContainer;
    }

    addFruitContainer(){
        this.container.append(this.fruitContainer);    
    }

    toggleRain() {

        this.isRaining = !this.isRaining;
        this.rain.style.display = this.isRaining ? 'flex' : 'none';

        const stopRainIfCloudEmpty = () => {
            if (this.cloudLitres === 0) {
                this.isRaining = false;
                this.rain.style.display = 'none';
            } 
        };

        const rainSound = this.sounds.find(({name}) => name === 'rain');

        let soundServiceStart;

        const soundService = (timestamp) => {
            stopRainIfCloudEmpty();
            console.log(this.isRaining);
            if (soundServiceStart === undefined) {
                soundServiceStart = timestamp;
                rainSound.play();
            }
            //rainSound.playAgainIfEnded(2);
            if(rainSound.getCurrentTime() > 5) {
                rainSound.setCurrentTime(1);
                rainSound.play();
            }
            if (!this.soundAllowed) {
                rainSound.mute();
            } else {
                rainSound.unmute();
            }
            if(!this.isRaining) {
                rainSound.stop();
            } else {
                requestAnimationFrame(soundService);
            }
        }
        this.isRaining && requestAnimationFrame(soundService);
  
    }

    checkRain() {
        return this.isRaining;
    }

    toggleCanTaken(e) {
        if( this.isPointerOnStation) {
            this.isCanTaken = !this.isCanTaken;
            this.can.style = '';
            this.can.style.left = this.isCanTaken ? `${e.clientX - this.container.offsetLeft - 10}px` : `${this.stationLeft}px`;
            this.can.style.top = this.isCanTaken ? `${e.clientY -this.container.offsetTop - 150}px` : `${this.stationTop}px`;
            const canImage = this.isCanTaken ? 'watering-can_water.png' : 'watering-can_stand.png';
            this.can.style.backgroundImage = `url('${this.imagesPath}${canImage}')`;
        }
    }

    highlightCanIfTargetPlant(){
        if(this.targetPlant) {
            this.can.classList.add('highlight');
        } else {
            this.can.classList.remove('highlight');
        }
    }

    startPourWater() {
        if(!this.isPointerOnStation){
            this.isCanWatering = true;
            this.splashes.style.display = 'block';
        }
    }

    canPourLiterOfWater() {
        this.canLitres --;
        if(this.targetPlant && this.isCanWatering) {
            this.targetPlant.gainWater();
        }
    }

    stopPourWater() {
        this.isCanWatering = false;
        this.splashes.style.display = 'none';
    }

    canGainLiterOfWater() {
        this.canLitres ++;
        this.updateCanInfo();
    }

    setCloudOpacity(value){
        this.cloud.style.opacity = value;
    }

    cloudPourWater(){
        const timer = setInterval(() => {
            if (this.isRaining && this.cloudLitres > 0) {
                this.cloudLitres --;
                this.setCloudOpacity(Math.min(1,this.cloudLitres/this.maxCanLitres));
                if (!this.canIsTaken && (this.canLitres < this.maxCanLitres)) {
                    this.canGainLiterOfWater();
                }
            } else {
                clearInterval(timer);
                this.cloudGainWater();
            }
        }, 300);
        
    }

    cloudGainWater() {
        const timer = setInterval(() => {
            if(!this.isRaining && (this.cloudLitres < this.maxCloudLitres)) {
                this.cloudLitres ++;
                this.setCloudOpacity(Math.min(1,this.cloudLitres/this.maxCanLitres));
            } else {
                clearInterval(timer);
            }
        }, 500)
    }

    

    setTargetPlant(e) {
        const targetPlant = this.plants.find(plant => this.checkCanTrunkOnPlant(plant, e));
        this.targetPlant = targetPlant ? targetPlant : null;
        
    }

    checkCanTrunkOnPlant(plant, e) {
        return (plant.top <= e.clientY - this.container.offsetTop &&
                plant.left + plant.width <= e.clientX - this.container.offsetLeft && 
                plant.left + plant.width  + 20 >= e.clientX - this.container.offsetLeft &&
                plant.top + plant.height - 40 >= e.clientY - this.container.offsetTop)
    }

    checkPointerOnStation(e) {
        if (e.clientX - this.container.offsetLeft > this.stationLeft &&
            e.clientX - this.container.offsetLeft < this.stationRight &&
            e.clientY - this.container.offsetTop > this.stationTop && 
            e.clientY - this.container.offsetTop < this.stationBottom) {
            this.isPointerOnStation = true;
        }  else {
            this.isPointerOnStation = false
        }
    }

    checkIfAllPlantsRipe() {
        return this.plants.every(plant => plant.isRipe)
    }

    setText(textArray, container) {
            container.innerHTML = '';
            for (let text of textArray) {
                const paragraph = document.createElement('p');
                paragraph.textContent = text;
                container.append(paragraph);
            }
    }

    addRainbow(container){
        const rainbow = document.createElement('div');
        rainbow.classList.add('rainbow');
        container.append(rainbow);
    }

    async addHarvest(container, positionParams={}){
        return new Promise((resolve, reject) => {
            const harvest = document.createElement('div');
            harvest.classList.add('harvest');
            for (let param of Object.keys(positionParams)) {
                harvest.style[param] = positionParams[param];
            }
            container.append(harvest);
            harvest.addEventListener('click', () => {
                this.addRainbow(container);
                resolve();
            }, {once: true});
        })
        
    }

    addEnvelope(textArray, container, positionParams={}){
        const envelope = document.createElement('div');
        envelope.classList.add('envelope');
        for (let param of Object.keys(positionParams)) {
            envelope.style[param] = positionParams[param];
        }
        container.append(envelope);
        envelope.addEventListener('click', () => {
            this.addCongrats(textArray, container);
        }, {once: true})

        this.envelope = envelope;
    }

    addCongrats(textArray, container, positionParams={}){
        const congrats = document.createElement('div');
        congrats.classList.add('congrats');
        for (let param of Object.keys(positionParams)) {
            congrats.style[param] = positionParams[param];
        }
        container.append(congrats);
        this.setText(textArray, congrats);
    }

    addAtStationClick(){
        this.container.addEventListener('click', this.toggleCanTaken.bind(this));
    }

    addOnCloudClick(){
        this.cloud.addEventListener('click', ()=> {
            this.toggleRain();
            this.cloudPourWater();
            this.cloudGainWater();
        });
    }

    addSound(soundInstance){
        if (soundInstance instanceof AppSound) {
            this.sounds.push(soundInstance);
        }
        
    }

    moveCanAround(){
        this.container.addEventListener('mousemove', (e) => {
            this.checkPointerOnStation(e);
            if(this.isCanTaken) {
                this.can.style.top = `${e.clientY - this.container.offsetTop - 150}px`;
                this.can.style.left = `${e.clientX - this.container.offsetLeft - 10}px`;
                this.setTargetPlant(e);
                this.highlightCanIfTargetPlant();
            }
        })
    }

    async addCanWaterService() {
        return new Promise( (resolve, reject) => {
            this.can.addEventListener('mousedown', () => {
                if(this.canLitres > 0 && this.isCanTaken){
                    this.startPourWater();
                    const timer = setInterval(()=>{
                        if(this.canLitres > 0 && this.isCanWatering) {
                            this.canPourLiterOfWater();
                            this.updateCanInfo();
                            if(this.checkIfAllPlantsRipe()) {
                                resolve();
                            }
                        } else {
                            this.stopPourWater();
                            clearInterval(timer);
                        }
                    }, 200)
                }
            })
            this.can.addEventListener('mouseup', () => {
                this.stopPourWater();
            })
        })
        
    }

    async addPickFruits() {
        return new Promise( (resolve, reject) => {
            this.fruits.forEach(fruit => {
                fruit.addEventListener('dragstart', (e) => {
                    this.draggedFruit = e.target;      
                })

                fruit.addEventListener('dragend', (e) => {
                    if(e.target.getAttribute('data-fruit') === e.target.parentElement.getAttribute('data-drop')) {
                        e.target.setAttribute('data-picked', 'right');
                        if (this.fruits.every(fruit => fruit.getAttribute('data-picked') === 'right')) {
                            setTimeout(()=> resolve(), 2000);
                        }
                    } else {
                        e.target.setAttribute('data-picked', 'wrong');
                    }
                    this.draggedFruit = null;
                })
            })
        })
    }

    addDropFruitInBaskets(){
        this.baskets.forEach(basket => {
            basket.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
    
            basket.addEventListener('drop', (e) => {
                if (e.target.matches('.basket') && !e.target.querySelector('[data-fruit]')) {
                    e.target.append(this.draggedFruit);
                }
            });
        })
    }

    addDropFruitsBack() {
        this.container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.container.addEventListener('drop', (e) => {
            if(e.target === this.container) {
                this.fruitContainer.append(this.draggedFruit);
            } 
        });
    }

    setWelcomeView(welcomeText, triggerText) {
        return new Promise((resolve, reject) => {
            this.createInformator('cat.png');
            this.addInformator();
            this.placeInfomator({left: '50%', top: '50%', transform: 'translate(-50%, -50%)'});
            const welcomeTextContainer = this.informator.querySelector('.informator_text-wrapper');
            this.setText(welcomeText, welcomeTextContainer);
            this.addSelfRemovingTrigger(triggerText, ()=> {resolve()}, this.informator.querySelector('.informator_text'));
        }) 
    }

    async setGrowingView(growPlantsText) {
        await this.setNewView('growPlantContainer', 2000); 
        this.addInformator();
        this.placeInfomator({transform: 'translate(0,0)', bottom: '20px', left: '20px'});
        const growPlantsTextContainer = this.informator.querySelector('.informator_text-wrapper');
        this.setText(growPlantsText, growPlantsTextContainer);
        this.createCan();
        this.createCanInfo();
        this.addCanInfo(this.container, 0, {right: '20px', bottom: '20px'});
        this.updateCanInfo();
        this.createCloud('cloud.png', 'rain.gif');
        await this.addCan(this.container, 1000, {right: '20px', bottom: '20px'});
        window.addEventListener('resize', this.setCanStationCoords.bind(this));
        
        await this.addCloud(this.container, 1000, {top: '20px', right: '20px'});
        this.addAtStationClick();
        this.addOnCloudClick();
        this.moveCanAround();
        this.createFruitContainer();
        this.addFruitContainer();
    }

    async setPickFruitView(pickFruitText) {
        await this.setNewView('growPlantContainer', 2000);
        this.addFruitContainer();
        this.plants.forEach(plant => {
            plant.giveFruit(this.fruitContainer);
            this.fruits.push(plant.fruit);
            this.baskets.push(plant.basket);
        })
        this.addInformator();
        const pickFruitTextContainer = this.informator.querySelector('.informator_text-wrapper');
        this.setText(pickFruitText, pickFruitTextContainer);
        


        // remove container listeners
        // remove cloud and can
        // remove pots

        // create and place baskets on pot places
        // add dropover and drop listeners on baskets
        // add draggable attribute on fruits
        // add drag listeners on fruits
        // if all fruits placed right, resolve
        
        // hide remove all fruits, remove all baskets
        // swing opacity 
        // setText
        // add harvest 
        // add envelope
        // add harvest and envelope listeners
        // when rainbow is shown, cat disappears and is removed

    }



    async setCongratsView(beforeRainbowText, beforeCongratsText, congratsText) {
        await this.setNewView('growPlantContainer', 2000);
        this.addInformator();
        const infoTextContainer = this.informator.querySelector('.informator_text-wrapper');
        this.setText(beforeRainbowText, infoTextContainer);
        await this.addHarvest(this.container);
        this.setText(beforeCongratsText, infoTextContainer);
        setTimeout(() => {
            this.informator.querySelector('.informator_text').remove();
            this.addEnvelope(congratsText, this.container)
        }, 10000)
    }
}