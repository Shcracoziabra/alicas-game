export default class Plant{
    constructor({name, top, left, waterToStage1, waterToStage2, waterToStage3, fruitContainer}){
        this.name = name;
        this.top = top;
        this.left = left;
        this.width = 60;
        this.height = 100;
        this.waterToStage1 = waterToStage1;
        this.waterToStage2 = waterToStage2;
        this.waterToStage3 = waterToStage3;
        this.consumedWater = 0;
        this.isRipe = false;
        this.isPicked = false;
        this.fruitContainer = fruitContainer;
        this.init();
    }

    init(){
        this.createPotForPlant();
        this.setPlantInfo();
        this.createFruitForPlant();
        this.createBasketForPlant();
    }

    createPotForPlant(){
        const pot = document.createElement('div');
        pot.classList.add('pot');
        pot.setAttribute('data-plant', this.name);
        pot.style.top = `${this.top}px`;
        pot.style.left = `${this.left}px`;
        pot.style.height = `${this.height}px`;
        pot.style.width = `${this.width}px`;
        this.pot = pot;

        const consumedWaterInfo = document.createElement('p');
        this.consumedWaterInfo = consumedWaterInfo;
        this.pot.append(this.consumedWaterInfo);
    }

    createBasketForPlant() {
        const basket = document.createElement('div');
        basket.classList.add('basket');
        basket.setAttribute('data-drop', this.name);
        basket.style.top = `${this.top + 15}px`;
        basket.style.left = `${this.left}px`;

        const basketTitle = document.createElement('p');
        basketTitle.classList.add('basket-title');
        basket.append(basketTitle);
        basketTitle.innerText = this.name;

        this.basket = basket;
    }

    createFruitForPlant() {
        const fruit = document.createElement('div');
        fruit.style.backgroundImage = `url('./assets/${this.name}.png')`;
        fruit.setAttribute('data-fruit', this.name);
        fruit.setAttribute('draggable', true);
        this.fruit = fruit; 
    }

    gainWater(){
        if(this.consumedWater < this.waterToStage3){
            this.consumedWater ++;
            this.setPlantStage();
            this.setPlantInfo();
        }  
    }


    setPlantStage(){
        switch(this.consumedWater){
            case this.waterToStage1: 
                this.pot.style.backgroundPosition = '33.3%';
                break;
            case this.waterToStage2: 
                this.pot.style.backgroundPosition = '66.6%';
                break;
            case this.waterToStage3: 
                this.pot.style.backgroundPosition  = '100%';
                if(!this.isRipe){
                    this.giveFruit(this.fruitContainer);
                }
                break;
            default: return;
        }
    }

    setPlantInfo(){
        this.consumedWaterInfo.innerText = this.consumedWater;
    }

    giveFruit(container){
        this.isRipe = true;
        container.append(this.fruit);
        //console.log(this.fruit);
    }

    addPickFruit() {
        this.fruit.addEventListener('dragstart', () => {
            this.fruit.style.display = 'none';
        })

        this.fruit.addEventListener('dragend', () => {
            this.fruit.style.display = '';
        })
    }

    addDropFruit(){
        this.basket.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.basket.addEventListener('drop', () => {
            if (!this.basket.querySelector('[data-fruit]')) {

            }
        });
    }
        


    placeWithDelay(elem, container, delay, i=1){
        return new Promise ((resolve, reject) => {
            setTimeout(() => {
                resolve(container.append(elem));
            }, 300 + delay*i);
        })
    }
}