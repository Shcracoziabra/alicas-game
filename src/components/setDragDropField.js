import Block from "../baseClasses/block.js";

export async function setDragAndDropPair({
    container, 
    name, 
    dragContainer, 
    imgForBg, 
    dragClasses, 
    dropClasses, 
    dropTitleClasses, 
    dropTop, 
    dropLeft, 
    appearSound
}) {
    const drag = new Block({
        name: name,
        wrapper: {
            classes: dragClasses,
            attributes: [
                {name: 'data-drag', value: name},
                {name: 'data-match', value: false},
                {name: 'draggable', value: true}
            ]
        }
    });

    if(imgForBg) {
        drag.block.style.backgroundImage = `url(${imgForBg})`;
    }

    const drop = new Block({
        name: name,
        wrapper: {
            classes: dropClasses,
            attributes: [
                {name: 'data-drop', value: name}            
            ]
        },
        innerElems: [
            {
                name: 'title',
                classes: dropTitleClasses,
            }
        ]
    });

    drop.setTextInPart({name: 'title', text: name});
    drag.addTo(dragContainer);
    appearSound.playWatchingSoundAllowed();

    await drop.place({params: {top: `${dropTop}px`, left: `${dropLeft}px`}, delay: 1000});
    
    drop.addTo(container);
    appearSound.playWatchingSoundAllowed();


    return ({drag: drag, drop: drop});
}

export async function setDragAndDropField({
    dragDropPairParams, 
    container, 
    imagePath, 
    dragSound, 
    dropSound, 
    appearSound, 
    infoInstance,
    wrongMatchText,
    rightMatchText
}) {
    return new Promise((resolve, reject) => {

        let harvestContainer = new Block({
            name: 'fruit-container',
            wrapper: {
                classes: ['fruit-container']
            }
        })

        harvestContainer.addTo(container);

        let dragged;

        dragDropPairParams.forEach(async({ name, top, left, imgFruit })=> {
            const pair = await setDragAndDropPair({
                container: container,
                name: name,
                dragContainer: harvestContainer.block,
                imgForBg: imagePath + imgFruit,
                dragClasses: ['fruit'],
                dropClasses: ['basket'],
                dropTitleClasses: ['basket-title'],
                dropTop: top,
                dropLeft: left,
                appearSound: appearSound
            });

            const { drag, drop } = pair;

            drag.block.addEventListener('dragstart', (e) => {
                dragged = e.target;
                if (e.target.parentElement.matches('[data-filled]')) {
                    e.target.parentElement.removeAttribute('data-filled');
                }
                dragSound.playWatchingSoundAllowed();
            });

            drop.block.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            drop.block.addEventListener('drop', (e) => {
                e.preventDefault();


                if(e.target.matches('[data-drop]') && !e.target.querySelector('[data-drag')) {
                    e.target.append(dragged);
                    e.target.setAttribute('data-filled', true);
                    if(e.target.getAttribute('data-drop') === dragged.getAttribute('data-drag')) {
                        dragged.setAttribute('data-match', true);
                    } else {
                        dragged.setAttribute('data-match', false);
                    }
                    dropSound.playWatchingSoundAllowed();
                    dragged = null;
                }

                const filledBaskets = container.querySelectorAll('[data-filled]');
                const harvest = container.querySelectorAll('[data-match=true]');


                async function onAllDropped(){
                    if (dragDropPairParams.length === harvest.length) {
                        await infoInstance.graduallyDisappear(1000, infoInstance.block);
                        infoInstance.setTextParagraphs({
                            name: 'content',
                            textArray: rightMatchText
                        });
                        await infoInstance.graduallyAppear(1000, infoInstance.block);
                        setTimeout(() => {
                            resolve();
                        }, 2000);
                    } else {
                        await infoInstance.graduallyDisappear(1000, infoInstance.block);
                        infoInstance.setTextParagraphs({
                            name: 'content',
                            textArray: wrongMatchText
                        });
                        await infoInstance.graduallyAppear(1000, infoInstance.block);
                    }
                }

                if (dragDropPairParams.length === filledBaskets.length) {
                    onAllDropped();
                }
            });

        });
    
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            if(e.target === container) {
                harvestContainer.block.append(dragged);
                dragged.setAttribute('data-match', false);
            }
        });
    });
    
}
