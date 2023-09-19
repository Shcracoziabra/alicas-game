import Block from "../baseClasses/block.js";
import setInformator from "./setInformator.js";
import setWateringCan from "./setWateringCan.js";
import setCloud from "./setCloud.js";
import {setDragAndDropField} from "./setDragDropField.js";
import { setAllPlants } from "./setPlant.js";
import { plantsParams } from "../configure/plantsParams.js";

export function toggleSound(selector){
    document.querySelector(selector).addEventListener('click', () => {
        document.querySelector(selector).classList.toggle('play');
    })
}

export async function setWelcomeView({
    container = null, 
    classes = [], 
    bgImage = '',
    text = [], 
    btnSound, 
    outroSound,
    imagePath = ''
}) {

    const welcomeView = new Block({
        name: 'welcome-view',
        wrapper : {
            classes: classes
        }
    });

    welcomeView.block.style.backgroundImage = `url('${imagePath}${bgImage}')`;
    welcomeView.block.style.filter = 'none';
    
    welcomeView.addTo(container);
    await welcomeView.graduallyAppear(3000, welcomeView.block);
    await setInformator({
        container: welcomeView.block, 
        text: text, 
        btnSettings: {
            text:'Почнімо!',
            className: 'informator_btn',
            sound: btnSound,
            delay: 0
        }
    });
    outroSound.playWatchingSoundAllowed();
    await welcomeView.graduallyDisappear(3000, welcomeView.block);
    welcomeView.remove();

}

export async function setGrowingPlantView({
    container = null, 
    classes = [], 
    bgImage = '',
    text = [], 
    introSound, 
    outroSound, 
    toolSounds = [], 
    appearSound,
    imagePath = ''
}) {

    introSound && introSound.playWatchingSoundAllowed();

    const growPlantView = new Block({
        name: 'plant-view',
        wrapper : {
            classes: classes
        }
    });

    growPlantView.block.style.backgroundImage = `url('${imagePath}${bgImage}')`;
    growPlantView.block.style.filter = 'none';
    growPlantView.addTo(container);
    
    await growPlantView.graduallyAppear(3000, growPlantView.block);

    await setInformator({
        container: growPlantView.block, 
        text: text, 
    });
    

    appearSound.playWatchingSoundAllowed();
    let wateringCan = await setWateringCan({
        container: growPlantView.block,
        sounds : toolSounds.find(({toolName}) => toolName === 'watering-can'),
        appearDelay: 1000
    });
    

    const cloud = await setCloud({
        container: growPlantView.block,
        entityToFill: wateringCan,
        sounds : toolSounds.find(({toolName}) => toolName === 'cloud'),
        appearDelay: 2000
    })
    appearSound.playWatchingSoundAllowed();

    let plants = [];

    await setAllPlants({
        container: growPlantView.block,
        plantsParams: plantsParams,
        arrayToSave: plants,
        appearSound: appearSound
    });

    growPlantView.block.addEventListener('mousemove', (e) => {
        if (wateringCan.isMoving ){
            const target = plants.find(plant => plant.isTarget(e));
            if (target) {
                wateringCan.target = target;
            } else {
                wateringCan.target = ''
            }
            wateringCan.highLightIfHasTarget();
        }
    });

    async function removeViewWhenAllPLantsRipe(){
        let out = false;
        return new Promise((resolve, reject) => {
        growPlantView.block.addEventListener('contextmenu', async (e)=> {
                if(plants.every(plant => plant.finish)) {
                    if (!out) {
                        out = true;
                        outroSound.playWatchingSoundAllowed();
                        await growPlantView.graduallyDisappear(3000, growPlantView.block);
                        growPlantView.remove();
                        resolve();
                    }   
                }
            })           
        })
    }

    await removeViewWhenAllPLantsRipe();
    
    toolSounds.find(({toolName}) => toolName === 'cloud').actionSound.stop();

}

export async function setPickFruitView({
    container = null, 
    classes = [],
    bgImage = '', 
    text = [], 
    introSound, 
    outroSound, 
    appearSound, 
    dragSound, 
    dropSound, 
    imagePath = '',
    wrongMatchText,
    rightMatchText
}) {

   introSound && introSound.playWatchingSoundAllowed();

    const fruitView = new Block({
        name: 'fruit-view',
        wrapper : {
            classes: classes
        }
    });

    fruitView.block.style.backgroundImage = `url('${imagePath}${bgImage}')`;
    fruitView.block.style.filter = 'none';
    fruitView.addTo(container);
    
    await fruitView.graduallyAppear(3000, fruitView.block);
    
    const { wrapper } = await setInformator({
        container: fruitView.block, 
        text: text, 
    });

    await setDragAndDropField({
        dragDropPairParams: plantsParams,
        container: fruitView.block,
        imagePath: imagePath,
        dragSound: dragSound,
        dropSound: dropSound,
        appearSound: appearSound,
        infoInstance: wrapper,
        wrongMatchText: wrongMatchText,
        rightMatchText: rightMatchText
    })    
    
    outroSound.playWatchingSoundAllowed();
    await fruitView.graduallyDisappear(3000, fruitView.block);
    fruitView.remove();

}

export async function setCongratsView({
    container = null, 
    classes = [], 
    bgImage = '',
    firstTaskText = [], 
    secondTaskText = [], 
    congratsText = [], 
    harvestSound,
    rainbowSound,
    introSound, 
    outroSound,
    imagePath = ''
}) {
    introSound && introSound.playWatchingSoundAllowed();

    const congratsView = new Block({
        name: 'congrats-view',
        wrapper : {
            classes: classes
        }
    });

    congratsView.block.style.backgroundImage = `url('${imagePath}${bgImage}')`;
    congratsView.block.style.filter = 'none';
    congratsView.addTo(container);
    
    await congratsView.graduallyAppear(3000, congratsView.block);
    
    let {informator, wrapper} = await setInformator({
        container: congratsView.block, 
        text: firstTaskText, 
    });

    let harvest = new Block({
        name: 'harvest',
        wrapper: {
            classes: ['harvest']
        }
    });

    let rainbow = new Block({
        name: 'rainbow',
        wrapper: {
            classes: ['rainbow']
        }
    });

    let congrats = new Block({
        name: 'congrats',
        wrapper: {
            classes: ['congrats']
        }
    });

    harvest.addTo(congratsView.block);
    harvestSound.playWatchingSoundAllowed();
    await harvest.graduallyAppear(1000, harvest.block);

    async function rainbowPromise() {
        return new Promise((resolve,reject) => {
            harvest.block.addEventListener('click', async(e) => {
                rainbow.addTo(congratsView.block);
                rainbowSound.playWatchingSoundAllowed();
                await rainbow.graduallyAppear(3000, rainbow.block);
                resolve();
            }, { once: true });
        })
    }

    await rainbowPromise();

    await wrapper.graduallyDisappear(2000, wrapper.block);
    wrapper.setTextParagraphs({
        name: 'content',
        textArray: secondTaskText
    });

    harvestSound.playWatchingSoundAllowed();
    await wrapper.graduallyAppear(2000, wrapper.block);

    await informator.hide(informator.getPart('aside'), 5000);
    informator.place({
        params: {top: '384px', left: '700px', bottom: ''}
    });

    let envelope = new Block({
        name: 'envelope',
        wrapper: {
            classes: ['envelope']
        }
    });

    envelope.addTo(congratsView.block);
    envelope.place({
        params: {top: '430px', left: '650px'}
    });
    harvestSound.playWatchingSoundAllowed();

    envelope.block.addEventListener('click', async ()=>{
        congrats.addTo(congratsView.block);
        congrats.setTextParagraphs({
            name: 'congrats',
            textArray: congratsText
        });
        envelope.block.remove();

        outroSound.playWatchingSoundAllowed();
        await congrats.graduallyAppear(3000, congrats.block);
    });

}