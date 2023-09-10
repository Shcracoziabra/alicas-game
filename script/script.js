import Sound from "./baseClasses/sound.js";
import {    setWelcomeView, 
            setGrowingPlantView, 
            setPickFruitView, 
            setCongratsView, 
            toggleSound 
        } from "./components/setViews.js";
import { soundPath, soundParams } from "./configure/soundParams.js";
import { textParams } from "./configure/textParams.js"; 

const worksOnlyOnPcMessage = 'Гра працює лише на персональному комп\'ютері';
const minWidth = 1200;
const minHeight = 600;
const dimensionsMessage = `
    Мінімальні параметри екрану ${minWidth}px x ${minHeight}px. 
    Збільшіть вікно браузера та перезавантажте сторінку.
`;

window.addEventListener('DOMContentLoaded', async (e) => {

    console.log(document.documentElement.clientWidth, document.documentElement.clientHeight, navigator.userAgent.includes("Chrome"));

    document.body.style.backgroundImage = `url('../assets/image/bg-optimized.webp')`;
    const root = document.querySelector('.root');

    async function checkBasicClientParams(){
        return new Promise((resolve, reject) => {
            if  (   'ontouchstart' in window ||
                    navigator.maxTouchPoints > 0  ||
                    navigator.msMaxTouchPoints > 0 
                ) 
            {
                root.append(worksOnlyOnPcMessage);
            } else {
                if( document.documentElement.clientWidth < minWidth ||
                    document.documentElement.clientHeight < minHeight) {
                    root.append(dimensionsMessage);
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
        bgImage: 'bg-0-optimized.wepb',
        text: textParams.find(({name}) => name === 'welcomeText').text,
        btnSound: audios.find(({name}) => name === 'take'),
        outroSound: audios.find(({name}) => name === 'harvest')
    });
    
    gardenSound.playWatchingSoundAllowed(game);
    
    await setGrowingPlantView({
        container: root, 
        classes: ['view-1'], 
        bgImage: 'bg-1-optimized.wepb',
        text: textParams.find(({name}) => name === 'growPlantsText').text,
        introSound: audios.find(({name}) => name === 'view-intro'),
        outroSound: audios.find(({name}) => name === 'harvest'),
        appearSound: audios.find(({name}) => name === 'place'),
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
        bgImage: 'bg-2-optimized.wepb',
        text: textParams.find(({name}) => name === 'pickFruitText').text,
        imagePath: '../assets/image/',
        dragSound: audios.find(({name}) => name === 'take'),
        dropSound: audios.find(({name}) => name === 'put'),
        appearSound: audios.find(({name}) => name === 'place'),
        introSound: audios.find(({name}) => name === 'view-intro'),
        outroSound: audios.find(({name}) => name === 'harvest')
    });
    
    await setCongratsView({
        container: root,
        classes: ['view-3'],
        bgImage: 'bg-3-optimized.wepb',
        firstTaskText: textParams.find(({name}) => name === 'rainbowText').text,
        secondTaskText: textParams.find(({name}) => name === 'envelopeText').text,
        congratsText: textParams.find(({name}) => name === 'congratsText').text,
        harvestSound: audios.find(({name}) => name === 'harvest'),
        rainbowSound: audios.find(({name}) => name === 'rainbow'),
        introSound: audios.find(({name}) => name === 'view-intro'),
        outroSound: audios.find(({name}) => name === 'fairy')
    })
});

