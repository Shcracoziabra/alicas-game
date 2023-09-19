import Sound from "./baseClasses/sound.js";
import {    setWelcomeView, 
            setGrowingPlantView, 
            setPickFruitView, 
            setCongratsView, 
            toggleSound 
        } from "./components/setViews.js";
        
import { soundParams } from "./configure/soundParams.js";
import { textParams } from "./configure/textParams.js"; 

const imagePath = "./assets/image/";
const soundPath = "./assets/sound/";

const worksOnlyOnPcMessage = 'Гра працює лише на персональному комп\'ютері';

const minWidth = 1200;
const minHeight = 600;
const dimensionsMessage = `
    Мінімальні параметри екрану ${minWidth}px x ${minHeight}px. 
    Збільшіть вікно браузера та перезавантажте сторінку.
`;

const wrongDeviceMessage = document.createElement('div');
wrongDeviceMessage.classList.add('wrong-device');

window.addEventListener('DOMContentLoaded', async (e) => {

    window.addEventListener('contextmenu', (e)=> {
        e.preventDefault();
    })
    const root = document.querySelector('.root');

    async function checkBasicClientParams(){
        return new Promise((resolve, reject) => {
            if  (   'ontouchstart' in window ||
                    navigator.maxTouchPoints > 0  ||
                    navigator.msMaxTouchPoints > 0 
                ) 
            {
                !root.querySelector('.wrong-device') && root.append(wrongDeviceMessage);
                wrongDeviceMessage.append(worksOnlyOnPcMessage);
            } else {
                if( document.documentElement.clientWidth < minWidth ||
                    document.documentElement.clientHeight < minHeight) {

                        !root.querySelector('.wrong-device') && root.append(wrongDeviceMessage);
                        wrongDeviceMessage.append(dimensionsMessage);
                } else {
                    resolve();
                }
            }     
        })
    }

    await checkBasicClientParams();
    
    const soundToggleSelector = '[data-sound]';
    
    let audios = [];
    
    soundParams.forEach((param)=>{
        const audio = new Sound({
            container: root,
            soundToggleSelector: soundToggleSelector,
            soundPath: soundPath,
            audioParams: param
        });
        audios.push(audio);
    });
    
    toggleSound(soundToggleSelector);
    
    const game = {
        isActive: true
    }
    
    const gardenSound = audios.find(({name}) => name === 'garden');
    
    await setWelcomeView({
        container: root, 
        classes: ['view-0'], 
        bgImage: 'bg-0.jpg',
        text: textParams.find(({name}) => name === 'welcomeText').text,
        btnSound: audios.find(({name}) => name === 'take'),
        outroSound: audios.find(({name}) => name === 'harvest'),
        imagePath: imagePath
    });
    
    gardenSound.playWatchingSoundAllowed(game);
    
    await setGrowingPlantView({
        container: root, 
        classes: ['view-1'], 
        bgImage: 'bg-1.jpg',
        text: textParams.find(({name}) => name === 'growPlantsText').text,
        introSound: audios.find(({name}) => name === 'view-intro'),
        outroSound: audios.find(({name}) => name === 'harvest'),
        appearSound: audios.find(({name}) => name === 'place'),
        imagePath: imagePath,
        toolSounds: [
            {
                toolName: 'watering-can',
                startMovingSound: audios.find(({name}) => name === 'take'),
                actionSound: audios.find(({name}) => name === 'running-water'),
                stopMovingSound: audios.find(({name}) => name === 'put'),
            },
            {
                toolName: 'cloud',
                actionSound: audios.find(({name}) => name === 'rain')
            }
        ]
    });
    
    await setPickFruitView({
        container: root,
        classes: ['view-2'],
        bgImage: 'bg-2.jpg',
        text: textParams.find(({name}) => name === 'pickFruitText').text,
        imagePath: imagePath,
        dragSound: audios.find(({name}) => name === 'take'),
        dropSound: audios.find(({name}) => name === 'put'),
        appearSound: audios.find(({name}) => name === 'place'),
        introSound: audios.find(({name}) => name === 'view-intro'),
        outroSound: audios.find(({name}) => name === 'harvest'),
        wrongMatchText: textParams.find(({name}) => name === 'wrongMatchText').text,
        rightMatchText: textParams.find(({name}) => name === 'rightMatchText').text
    });
    
    await setCongratsView({
        container: root,
        classes: ['view-3'],
        bgImage: 'bg-3.jpg',
        firstTaskText: textParams.find(({name}) => name === 'rainbowText').text,
        secondTaskText: textParams.find(({name}) => name === 'envelopeText').text,
        congratsText: textParams.find(({name}) => name === 'congratsText').text,
        harvestSound: audios.find(({name}) => name === 'harvest'),
        rainbowSound: audios.find(({name}) => name === 'rainbow'),
        introSound: audios.find(({name}) => name === 'view-intro'),
        outroSound: audios.find(({name}) => name === 'fairy'),
        imagePath: imagePath
    })
});

