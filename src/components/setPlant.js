import ElemChangingOnGainResource from "../baseClasses/elemChandingOnGainResource.js";

export function setPlant({name, stages}) {
    const plant = new ElemChangingOnGainResource({
        name: name,
        wrapper: {
            classes: ['pot']
        }, 
        innerElems: [
            {
                name: 'resource-count',
                tag: 'p',
            }
        ],
        correctionsToBeTarget: {
            left: 30,
            bottom: -40,
            top: 0,
            right: 30
        },
        stages: stages
    });

    return plant;
}

export async function setAllPlants({container, appearSound, plantsParams, arrayToSave}) {
    plantsParams.forEach( async ({name, top, left, stages}, i) => {
        const plant = setPlant({
            name: name,
            stages: stages
        });

        await plant.place({params: {top: `${top}px`, left: `${left}px`}, delay: 600 * i});
        plant.addTo(container);
        appearSound.playWatchingSoundAllowed();
        arrayToSave.push(plant);
    })
}