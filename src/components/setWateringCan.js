import Tool from "../baseClasses/tool.js";

export default async function setWateringCan({container, sounds, appearDelay}) {

    const wateringCan = new Tool({
        activeClass: 'active',
        movingClass: 'moving',
        name: 'watering-can',
        wrapper: {
            classes: ['watering-can']
        },
        innerElems: [
            {
                name: 'splashes',
                classes: ['splashes']
            },
            {
                name: 'resource-count',
                tag: 'p'
            }
        ],
            
        canBeMoved: true,
        leftMoveCorrection: -10,
        topMoveCorrection: -150,
        maxResource: 40
    });

    wateringCan.setTextInPart({
        name: 'resource-count', 
        text: `${wateringCan.currentResource}л`
    });
    wateringCan.addTo(container);
    wateringCan.followMouse();

    if(appearDelay){
        await wateringCan.graduallyAppear(appearDelay, wateringCan.block);
    }

    
    const startMovingSound = sounds.startMovingSound;
    const stopMovingSound = sounds.stopMovingSound;
    const actionSound = sounds.actionSound;

    wateringCan.block.addEventListener('click', (e) => {
        if (!wateringCan.isMoving) {
            wateringCan.isMoving = true;
            wateringCan.block.classList.add(wateringCan.movingClass);
            wateringCan.togglePosition(e);
            if (startMovingSound) {
                stopMovingSound && stopMovingSound.stop();
                startMovingSound.stop();
                startMovingSound.playWatchingSoundAllowed();
            }
        }
    });

    wateringCan.block.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (wateringCan.isMoving) {
            wateringCan.isMoving = false;
            wateringCan.highLightIfHasTarget(wateringCan.target);
            wateringCan.block.classList.remove(wateringCan.movingClass);
            wateringCan.canBeMoved && wateringCan.togglePosition(e);
            if (stopMovingSound) {
                startMovingSound && startMovingSound.stop();
                stopMovingSound.stop();
                stopMovingSound.playWatchingSoundAllowed();
            }
        }
    });

    wateringCan.block.addEventListener('mousedown', (e) => {
        if(wateringCan.isMoving && e.button === 0) {
            if(wateringCan.currentResource > 0) {
                wateringCan.isActive = true;
            }
            const timer = setInterval(()=>{
                if(wateringCan.isActive){
                    wateringCan.looseResource();
                    wateringCan.isActive && wateringCan.target && wateringCan.target.gainResource();
                    wateringCan.target && wateringCan.target.getChangedOnResource();
                    wateringCan.setTextInPart({ 
                        name: 'resource-count', 
                        text: wateringCan.currentResource + 'л' 
                    });
                    wateringCan.target && wateringCan.target.setTextInPart({
                        name: 'resource-count', 
                        text: wateringCan.target.currentResource 
                    });
                } else {
                    wateringCan.toggleActivityClass();
                    clearInterval(timer);
                }
            }, 200);
            if(actionSound) {
                actionSound.stop();
                actionSound.playWatchingSoundAllowed(wateringCan);
            }
        }
    })

    wateringCan.block.addEventListener('mouseup', (e) => {
            wateringCan.isActive = false;
            wateringCan.block.classList.remove(wateringCan.activeClass);
            if(actionSound) {
                actionSound.stop();
            }
    })

    return wateringCan;

}