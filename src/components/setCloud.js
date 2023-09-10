import Tool from "../baseClasses/tool.js";

export default async function setCloud({container, entityToFill, sounds, appearDelay}) {

    const cloud = new Tool({
        activeClass: 'active',
        name: 'cloud',
        wrapper: {
            classes: ['cloud-wrapper']
        },
        innerElems: [
            {classes: ['cloud']},
            {classes: ['rain']},
        ],
        maxResource: 100,
        renewResourceOnEnd: true
    });

    cloud.addTo(container);
    if (appearDelay) {
        await cloud.graduallyAppear(appearDelay, cloud.block);
    }
    
    const actionSound = sounds.actionSound;

    cloud.block.addEventListener('click', (e) => {
        if(!cloud.isActive && cloud.currentResource > 0) {
            cloud.isActive = true;
            cloud.toggleActivityClass();
            cloud.fillWithResource({
                entityToFill: entityToFill,
                responsibleOpacity: true,
                units: 'л'
            });
            if(actionSound) {
                actionSound.playWatchingSoundAllowed(cloud);
            }
        }
        
    })

    cloud.block.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        cloud.isActive = false;
        cloud.toggleActivityClass();
        if(actionSound) {
            actionSound.stop();
        }
    })

    return cloud;
}