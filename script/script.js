import Garden from "./modules/garden.js";
import Plant from "./modules/plant.js";
import AppSound from "./modules/appSound.js";

// start code before refactoring

// import Plant from "./modules/plant.js";

// function setText(textArray, container){
//     container.innerHTML = '';
//     for(const text of textArray){
//         const paragraph = document.createElement('p');
//         container.append(paragraph);
//         paragraph.innerText = text;
//     }
// }


// function placePlants(plantsParams, container, arrToSaveExamples, fruitContainer){
//     plantsParams.forEach(( {name, top, left, waterToStage1, waterToStage2, waterToStage3, delay} )=> {
//         const plant = new Plant({
//             name: name,
//             top: top,
//             left: left,
//             waterToStage1: waterToStage1,
//             waterToStage2: waterToStage2,
//             waterToStage3: waterToStage3,
//             fruitContainer: fruitContainer
//         });
//         arrToSaveExamples.push(plant);
//         plant.placeWithDelay(container, delay);
//     })
// }

// stop code before refactoring

window.addEventListener('DOMContentLoaded', async () => {

    const root = document.querySelector('.root');
    const soundToggleElem = document.querySelector('.sound');
    const imagePath = '../assets/image/';
    const soundPath = '../assets/sound/';

    const soundParams = [
        {
            name: 'rain',
            src: 'rain.mp3',
            loop: false
        },
        {
            name: 'harvest',
            src: 'harvest.mp3',
            loop: false
        },
        {
            name: 'pop',
            src: 'pop.mp3',
            loop: false
        },
        {
            name: 'rainbow',
            src: 'rainbow.mp3',
            loop: false
        },
        {
            name: 'put',
            src: 'put.mp3',
            loop: false
        },
        {
            name: 'take',
            src: 'take.mp3',
            loop: false
        },
        {
            name: 'water',
            src: 'water.mp3',
            loop: true
        }

    ]
    

    const plantsParams = [
        {
            name: 'mint',
            top: 350,
            left: 300,
            potSize: 40,
            imgFruit: 'mint.png',
            waterToStage1: 10,
            waterToStage2: 15,
            waterToStage3: 20,
        },
        {
            name: 'carrot',
            top: 310,
            left: 380,
            imgFruit: 'carrot.png',
            waterToStage1: 10,
            waterToStage2: 15,
            waterToStage3: 20,
        },
        {
            name: 'pumpkin',
            top: 315,
            left: 167,
            imgFruit: 'pumpkin.png',
            waterToStage1: 5,
            waterToStage2: 10,
            waterToStage3: 15,
        },
        {
            name: 'raspberry',
            top: 335,
            left: 460,
            imgFruit: 'raspberry.png',
            waterToStage1: 5,
            waterToStage2: 8,
            waterToStage3: 18,
        },
        {
            name: 'strawberry',
            top: 570,
            left: 660,
            imgFruit: 'strawberry.png',
            waterToStage1: 10,
            waterToStage2: 12,
            waterToStage3: 15,
        },
        {
            name: 'tomato',
            top: 420,
            left: 940,
            imgFruit: 'tomato.png',
            waterToStage1: 10,
            waterToStage2: 12,
            waterToStage3: 15,
        },
        {
            name: 'pepper',
            top: 420,
            left: 850,
            imgFruit: 'pepper.png',
            waterToStage1: 10,
            waterToStage2: 15,
            waterToStage3: 20,
        },
        {
            name: 'peas',
            top: 420,
            left: 1050,
            imgFruit: 'peas.png',
            waterToStage1: 5,
            waterToStage2: 10,
            waterToStage3: 20,
        },
        {
            name: 'pineapple',
            top: 400,
            left: 760,
            imgFruit: 'pineapple.png',
            waterToStage1: 10,
            waterToStage2: 12,
            waterToStage3: 18,
        }

    ];



    const welcomeText = [
        'Привіт, Алісо і друзі!', 
        'Я радий вас бачити :)', 
        'Мені знадобиться ваша допомога.', 
        'Подивитеся на мій чудовий сад?'
    ];

    const growPlantsText = [
        'Маю горщики з рослинами, але забув, що де посіяв', 
        'Допоможіть мені їх виростити!', 
        'Справа в кутку стоїть лійка', 
        'Хмарка допоможе її наповнювати.'
    ];

    const pickFruitText = [
        'Дякую! Ми виростили рослини і настав час зібрати плоди',
        'Перенесіть їх, будь ласка, до відповідних кошиків'
    ];


    const beforeRainbowText = [
        'Ура, ми впоралися!', 
        'Дивись, який чудовий врожай на столі. Твій місяць нам дає багато прекрасного.',
        'Торкнись кошику і він покаже тобі веселку.'
    ];

    const beforeCongratsText = [
        'Але в мене є ще дещо для тебе.',
        'Почекай трохи.'
    ]

    const congratsText = [
        'З днем народження, Алісо!', 
        'Дякую тобі за допомогу.', 
        'Пригощайся смачним врожаєм.', 
        'Завжди радий бачити вас у своєму саду.', 
        'Обіймаю вас, друзі!:)'
    ];

    const garden = new Garden(root, soundToggleElem, imagePath, 'growPlantContainer', 40, 100);
    soundParams.forEach(param => {
        const sound = new AppSound(root, soundPath, param);
        garden.addSound(sound);
    })

    await garden.setWelcomeView(welcomeText, 'Почнімо!');
    await garden.setGrowingView(growPlantsText);
    plantsParams.forEach(( {name, top, left, waterToStage1, waterToStage2, waterToStage3, delay} )=> {
        const plant = new Plant({
            name: name,
            top: top,
            left: left,
            waterToStage1: waterToStage1,
            waterToStage2: waterToStage2,
            waterToStage3: waterToStage3,
            fruitContainer: garden.fruitContainer
        });
        garden.savePlant(plant);
    })

    await garden.addPlants(300);
    await garden.addCanWaterService(); 
    await garden.setPickFruitView(pickFruitText);
    await garden.addBaskets(300);
    garden.addDropFruitsBack();
    garden.addDropFruitInBaskets();
    await garden.addPickFruits();
    await garden.setCongratsView(beforeRainbowText, beforeCongratsText, congratsText);

// start code before refactoring

    // const informator = document.querySelector('.informator');
    // const infoContainer = informator.querySelector('.informator_text-wrapper');
    // const infoTrigger = informator.querySelector('.informator_btn');


    // const cloud = root.querySelector('.cloud');
    // const rain = root.querySelector('.rain');


    // const fruitContainer = root.querySelector('.fruit-container');
    // const wateringCan = root.querySelector('.watering-can');
    // const splashes = wateringCan.querySelector('.splashes');
    // const canRestElem = root.querySelector('.can-litres [data-rest]');
    // const canTotalElem = root.querySelector('.can-litres [data-total]');

    // const garden = {
    //     isRaining: false,
    //     isCanTaken: false,
    //     isCanOnStation: false,
    //     isCanWatering: false,
    //     targetPlantName: "",
    //     canLitres: 40,
    //     maxCanLitres: 40,
    //     cloudLitres: 100,
    //     maxCloudLitres: 100,
    //     draggedFruit: null,
    //     plants: [],
    //     fruits: []
    // };

    // const plantsParams = [
    //     {
    //         name: 'mint',
    //         top: 350,
    //         left: 300,
    //         potSize: 40,
    //         imgFruit: 'mint.png',
    //         waterToStage1: 20,
    //         waterToStage2: 40,
    //         waterToStage3: 60,
    //         delay: 100
    //     },
    //     {
    //         name: 'carrot',
    //         top: 310,
    //         left: 380,
    //         imgFruit: 'carrot.png',
    //         waterToStage1: 20,
    //         waterToStage2: 40,
    //         waterToStage3: 70,
    //         delay: 120
    //     },
    //     {
    //         name: 'pumpkin',
    //         top: 315,
    //         left: 167,
    //         imgFruit: 'pumpkin.png',
    //         waterToStage1: 20,
    //         waterToStage2: 60,
    //         waterToStage3: 70,
    //         delay: 200
    //     },
    //     {
    //         name: 'raspberry',
    //         top: 335,
    //         left: 460,
    //         imgFruit: 'raspberry.png',
    //         waterToStage1: 20,
    //         waterToStage2: 40,
    //         waterToStage3: 60,
    //         delay: 400
    //     },
    //     {
    //         name: 'strawberry',
    //         top: 570,
    //         left: 660,
    //         imgFruit: 'strawberry.png',
    //         waterToStage1: 10,
    //         waterToStage2: 30,
    //         waterToStage3: 70,
    //         delay: 500
    //     },
    //     {
    //         name: 'tomato',
    //         top: 420,
    //         left: 940,
    //         imgFruit: 'tomato.png',
    //         waterToStage1: 20,
    //         waterToStage2: 70,
    //         waterToStage3: 90,
    //         delay: 700
    //     },
    //     {
    //         name: 'pepper',
    //         top: 420,
    //         left: 850,
    //         imgFruit: 'pepper.png',
    //         waterToStage1: 10,
    //         waterToStage2: 60,
    //         waterToStage3: 80,
    //         delay: 900
    //     },
    //     {
    //         name: 'peas',
    //         top: 420,
    //         left: 1050,
    //         imgFruit: 'peas.png',
    //         waterToStage1: 30,
    //         waterToStage2: 40,
    //         waterToStage3: 50,
    //         delay: 280
    //     },
    //     {
    //         name: 'pineapple',
    //         top: 400,
    //         left: 760,
    //         imgFruit: 'pineapple.png',
    //         waterToStage1: 10,
    //         waterToStage2: 50,
    //         waterToStage3: 70,
    //         delay: 280
    //     }

    // ];

    // const welcomeText = [
    //     'Привіт, Алісо і друзі!', 
    //     'Я радий вас бачити :)', 
    //     'Мені знадобиться ваша допомога.', 
    //     'Подивитеся на мій чудовий сад?'
    // ];

    // const growPlantsText = [
    //     'Маю горщики з рослинами, але забув, що де посіяв', 
    //     'Допоможіть мені їх виростити!', 
    //     'Справа в кутку стоїть лійка', 
    //     'Хмарка допоможе її наповнювати.'
    // ];

    // const pickFruitsText = [
    //     'Дякую! Ми виростили рослини і настав час зібрати плоди',
    //     'Перенесіть їх, будь ласка, до відповідних кошиків'
    // ]

    // const congratsText = [
    //     'З днем народження, Алісо!', 
    //     'Дякую тобі за допомогу.', 
    //     'Пригощайся смачним врожаєм.', 
    //     'Завжди радий бачити вас у своєму саду.', 
    //     'Обіймаю вас, друзі!:)'
    // ];


    // setText(welcomeText, infoContainer);

    // infoTrigger.style.display = 'flex';
    // infoTrigger.innerText = 'Показуй!'


    // function hide(elem){
    //     elem.classList.remove('show');
    //     elem.classList.add('hide');  
    // }

    // function show(elem){
    //     elem.classList.remove('hide');  
    //     elem.classList.add('show'); 
    // }

    // function placeInformator(informator, container, delay){
    //     informator.classList.add('hide');
    //     container.append(informator);
    //     setTimeout(()=> {
    //         informator.classList.add('show');
    //     }, delay)

    // }

    // function setView(container, dataView, viewCallbacks){
    //     container.setAttribute('data-view', dataView);
    //     for ( let callback of viewCallbacks) {
    //         callback.name.apply({}, callback.arguments);
    //     }

    // }


    // function setGardenView(){
    //     const gardenViewCallbacks = [
    //         {
    //             name: placePlants,
    //             arguments: [plantsParams, root, garden.plants, fruitContainer]
    //         },
    //         {
    //             name: placeInformator,
    //             arguments: [informator, root, 40]
    //         },
    //         {
    //             name: setText,
    //             arguments: [growPlantsText, infoContainer]
    //         }
    //     ]
        
    //     infoTrigger.remove();
    //     show(root);
    //     setView(root, 'garden', gardenViewCallbacks);
    // }

    // infoTrigger.addEventListener('click', setGardenView);
    

    // function toggleDisplay(elem, condition) {
    //     if (condition){
    //         elem.style.display = 'block';
    //     } else {
    //         elem.style.display = 'none';         
    //     }
    // }

    // function toggleSplashes(){
    //     toggleDisplay(splashes, garden.isCanWatering);
    // }

    // function toggleRain(){
    //     toggleDisplay(rain, garden.isRaining);
    // };

    // function toggleCanView(canElem, standingClass, takenClass, condition){
    //     if (condition){
    //         canElem.classList.remove(standingClass);
    //         canElem.classList.add(takenClass);
    //         //canElem.style.cursor = 'none';
    //     } else {
    //         canElem.classList.remove(takenClass);
    //         canElem.classList.add(standingClass);
    //         canElem.style.cursor = '';
    //     }
    // }

    // function moveElemWithMouse(mouseX, mouseY, elem) {
    //     elem.style.left = mouseX - 80 + 'px';
    //     elem.style.top = mouseY -170 + 'px';
    // }

    // function moveCanWithMouse(e){
    //     if (garden.isCanTaken) {
    //         moveElemWithMouse(e.clientX, e.clientY, wateringCan);
    //     }
    // }

    // function putCanIfOnPlace(){
    //     if (garden.isCanOnStation) {
    //         garden.isCanTaken = !garden.isCanTaken;
    //         wateringCan.style.top = '';
    //         wateringCan.style.left = '';
    //         toggleCanView(wateringCan, 'can-standing', 'can-taken', garden.isCanTaken);
    //     }
    // }

    // function canLosesWater(){
    //     if(!garden.isCanOnStation && garden.canLitres > 0) {
    //         garden.isCanWatering = true;
    //         toggleSplashes();
    //         const timer = setInterval(() => {
    //             if(garden.isCanWatering && garden.canLitres > 0){
    //                 garden.canLitres --;
    //                 if(garden.targetPlantName) {
    //                     waterPlant(garden.plants, garden.targetPlantName);
    //                     console.log(garden.targetPlantName, garden.plants.find(plant => plant.name === garden.targetPlantName).consumedWater);
    //                 }
    //                 showLitresInTheCan(garden.canLitres, garden.maxCanLitres, canRestElem, canTotalElem)
    //             } else {
    //                 clearInterval(timer);
    //                 garden.isCanWatering = false;
    //                 toggleSplashes();
    //             }
    //         }, 200)
    //     }
    // }

    // function controlCloudWater(){
    //     garden.isRaining = !garden.isRaining;

    //     const loseWaterTimer = setInterval(() => {
    //         if(garden.cloudLitres > 0 && garden.isRaining){
    //             if(rain.style.display === 'none'){
    //                 toggleRain();
    //             } 
    //             garden.cloudLitres --;
    //             if(!garden.isCanTaken && garden.canLitres < garden.maxCanLitres){
    //                 garden.canLitres ++;
    //                 showLitresInTheCan(garden.canLitres, garden.maxCanLitres, canRestElem, canTotalElem);
    //             }
    //             cloud.style.opacity = `${garden.cloudLitres / 100}`;
    //             //showLitresInTheCan(garden.canLitres, garden.maxCanLitres, canRestElem, canTotalElem)
    //         } else {
    //             clearInterval(loseWaterTimer);
    //             garden.isRaining = false;
    //             toggleRain();
    //             const gainWaterTimer = setInterval(()=> {
    //                 if(!garden.isRaining && garden.cloudLitres < garden.maxCloudLitres) {
    //                     garden.cloudLitres ++ ;
    //                     cloud.style.opacity = Math.min(garden.cloudLitres / 100, 1);
    //                 } else {
    //                     clearInterval(gainWaterTimer);
    //                 }
    //             }, 400)
    //         }
    //     }, 200)
    // }

    // function showLitresInTheCan(rest, total, restElem, totalElem) {
    //     restElem.innerText = rest;
    //     totalElem.innerText = total;
    // }

    // function setTargetPlant(e) {
        
    //     const targetPlant = garden.plants.find(plant => {
    //         const targeted = e.clientX > plant.left && 
    //                          e.clientX < (plant.left + plant.width) &&
    //                          e.clientY > (plant.top) && 
    //                          e.clientY < (plant.top + plant.height) 
    //         return targeted;
    //     });

    //     if(targetPlant) {
    //         garden.targetPlantName = targetPlant.name;
    //     } else {
    //         garden.targetPlantName = "";
    //     }
    // }

    // function waterPlant(plantInstancesArray, plantName) {
    //     plantInstancesArray.forEach(plant => {
    //         console.log(plant.name, plant.name === plantName && plant.consumedWater < plant.waterToStage3);
    //         if(plant.name === plantName && plant.consumedWater < plant.waterToStage3){
    //             plant.gainWater();
    //             plant.setPlantStage();
    //         }
    //     })
    // }

    // function setIsCanOnStation(e){
    //     const rootWidth = +window.getComputedStyle(root).width.replace('px', '');
    //     const wateringCanWidth = +window.getComputedStyle(wateringCan).width.replace('px', '');

    //     const rootHeight = +window.getComputedStyle(root).height.replace('px', '');
    //     const wateringCanHeight = +window.getComputedStyle(wateringCan).height.replace('px', '');

    //     const topStationPoint = rootHeight - wateringCanHeight - 40;
    //     const leftStationPoint = rootWidth - wateringCanWidth - 40;

    //     if (e.clientX > leftStationPoint && e.clientY > topStationPoint){
    //         garden.isCanOnStation = true;
    //     } else {
    //         garden.isCanOnStation = false;
    //     }
    // }


    // showLitresInTheCan(garden.canLitres, garden.maxCanLitres, canRestElem, canTotalElem);
    
    // document.body.addEventListener('mousemove', moveCanWithMouse);
    // document.body.addEventListener('mousemove', setIsCanOnStation);
    // document.body.addEventListener('mousemove', setTargetPlant);

    // wateringCan.addEventListener('click', putCanIfOnPlace);
    // wateringCan.addEventListener('mousedown', canLosesWater);
    // wateringCan.addEventListener('mouseup', () => {
    //     garden.isCanWatering = false;
    // });

    // cloud.addEventListener('click', controlCloudWater);


    // toggleCanView(wateringCan, 'can-standing', 'can-taken', garden.isCanTaken);
    // toggleSplashes();
    // toggleRain();


    // async function showFruitView(){
    //     return new Promise((resolve, reject)=> {
    //         let allPlantsBecameFruits = false;
    //         function ifAllPlantsAreFruits(){
    //             allPlantsBecameFruits = document.querySelectorAll('[data-fruit]').length === plantsParams.length;
    //             if(allPlantsBecameFruits){
    //                 window.removeEventListener('mousemove', ifAllPlantsAreFruits);
    //                 resolve(document.querySelectorAll('[data-plant]'));
    //             };
    //         }
    //         window.addEventListener('mousemove', ifAllPlantsAreFruits);
    //     })
    // }


    // function removePlantViewlisteners(){
    //     document.body.removeEventListener('mousemove', moveCanWithMouse);
    //     document.body.removeEventListener('mousemove', setIsCanOnStation);
    //     document.body.removeEventListener('mousemove', setTargetPlant);
    // }

    // const elemsToRemove = await showFruitView();
    // removePlantViewlisteners();

    // elemsToRemove.forEach(elem => elem.remove());
    // cloud.parentElement.remove();
    // canRestElem.parentElement.remove();
    // wateringCan.remove();
    // plantsParams.forEach(({name, top, left}) => {
    //     addDropZone(name, top, left, root);
    //     garden.fruits.push({
    //         name: name,
    //         matched: false
    //     });
    // })


    // function addDropZone(name, top, left, container){
    //     const dropZone = document.createElement('div');
    //     const dropTitle = document.createElement('div');

    //     dropZone.setAttribute('data-drop', name);
    //     dropZone.style.top = `${top}px`;
    //     dropZone.style.left = `${left}px`;

    //     dropTitle.classList.add('drop-title');
    //     dropTitle.innerText = name;

    //     dropZone.append(dropTitle);
    //     container.append(dropZone); 

    //     dropZone.addEventListener('dragover', onDragOver);
    //     dropZone.addEventListener('drop', onZoneDrop);
    // }

    // document.querySelectorAll('[data-fruit]').forEach(elem => {
    //     elem.addEventListener('dragstart', onDragStart);
    //     elem.addEventListener('dragstart', onDragEnd);
    // })


    // document.body.addEventListener('dragover', onDragOver);
    // document.body.addEventListener('drop', onBodyDrop);
    


    // function onDragStart(e){
    //     garden.draggedFruit = e.target;
    //     e.target.opacity = 0.5;
    // }

    // function onDragEnd(e){
    //     e.target.opacity = '';
    // }

    // function onDragOver(e){
    //     e.preventDefault();
    // }

    // function onZoneDrop(e){
    //     e.stopPropagation();
    //     if (e.target.matches('[data-drop]') && !e.target.querySelector('[data-fruit]')) {
    //         console.log(e.target);
    //         e.target.insertAdjacentElement('afterBegin', garden.draggedFruit);
    //     }
    //     ifAllFruitsMatch();
    // }

    // function onBodyDrop(){
    //     fruitContainer.insertAdjacentElement('afterBegin', garden.draggedFruit);
    // }

    // function ifAllFruitsMatch(){
    //     const drops = document.querySelectorAll('[data-drop]');
    //     let matchedCount = 0;
    //     drops.forEach(drop => {
    //         const dropName = drop.getAttribute('data-drop');
    //         if(drop.querySelector('[data-fruit]') && dropName === drop.querySelector('[data-fruit]').getAttribute('data-fruit')) {
    //             matchedCount ++;
    //         }
    //     });
    //     if (matchedCount === drops.length) {
    //         setTimeout(()=> {
    //             drops.forEach(drop => {
    //                 drop.remove();
    //             });
    //             placeHarvest(root);                placeHarvest(root);
    //             placeEnvelope(congratsText, root);
    //         }, 2000);
            
    //     }
        
    // }

    // function placeRainbow(container){
    //     const rainbow = document.createElement('div');
    //     rainbow.classList.add('rainbow');
    //     container.append(rainbow);

    // }

    // function placeHarvest(container){
    //     const harvest = document.createElement('div');
    //     harvest.classList.add('harvest');
    //     container.append(harvest);
    //     harvest.addEventListener('click', ()=>{
    //         placeRainbow(root);
    //     })
    // }

    // function placeEnvelope(congratsText, container){
    //     const envelope = document.createElement('div');
    //     envelope.classList.add('envelope');
    //     envelope.addEventListener('click', ()=>{
    //         placeCongratsContainer(congratsText, container);
    //     })
    //     container.append(envelope);
    // }

    // function placeCongratsContainer(text, container){
    //     const congrats = document.createElement('div');
    //     congrats.classList.add('congrats');
    //     container.append(congrats);
    //     setText(text, congrats);
    // }

// stop code before refactoring


    //console.log(ready);

    // show cat
    // type text 
    // when text is typed, show btn after 1000ms
    // when btn is clicked, change layer
    // when layer is changed, show cat after 1000ms
    // type text
    // when text is typed, show cloud and a watering can
    // when watering can is shown, show every pot.
    // after all pots are shown, add event listener to window, to cloud, to watering can
    // after pot is fully watered, change to fruit
    // when all pots are turned to fruit, remove a watering can and cloud.
    // remove event listeners from body
    // change info
    // add named drop zones for fruits
    // add event listeners for all fruits, zones and body
    // after all fruits fit, remove fruits and zones with 1000ms delay
    // show harvest and envelope on the table
    // change info
    // add listener to envelope


    
    // function typeText(textArr, letterDelay, rowDelay, container)
    // function setGarden (plantsArray, canObj, cloudObj)
    // function addGardenListeners
    // cloudListener
    // gardenListener
    // function placeItems
    // function setSize
    // function addHarvestListeners
    // function dropListener
    // function removeElems
    // function addElems
    // function appear
    // function disappear

    // #drops {
    //     bottom: -40px;
    //     left: -70px;
    // }
    
    // #pot_1 {
    //     top: 250px;
    //     left: 300px;
    // }
    
    // #pot_2 {
    //     top: 230px;
    //     left: 380px;
    // }
    
    // #pot_3 {
    //     top: 239px;
    //     left: 164px;
    // }
    
    // #pot_4 {
    //     top: 335px;
    //     left: 460px;
    // }
    
    // #pot_5 {
    //     top: 295px;
    //     left: 830px;
    // }
    
    // #pot_6 {
    //     top: 300px;
    //     left: 970px;
    // }
    
    // #pot_7 {
    //     top: 310px;
    //     left: 890px;
    // }
    
    // #pot_8 {
    //     top: 300px;
    //     left: 1050px;
    // }
    
    // #pot_9 {
    //     top: 290px;
    //     left: 720px;
    // }

});
