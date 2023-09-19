import Block from "./block.js";
import Sound from "./sound.js";

export default class Tool extends Block {
    constructor({
        activeClass,
        movingClass,
        name, 
        wrapper = {
            tag:'div', 
            classes:[], 
            attributes:[]
        }, 
        innerElems = [], 
        correctionsToBeTarget = {
            left:0,
            top:0,
            right: 0,
            bottom: 0
        },
        renewable = true,
        renewResourceOnEnd = false,
        canBeMoved = false,
        leftMoveCorrection = 0,
        topMoveCorrection = 0,
        maxResource
    }){
        super({name, wrapper, innerElems, correctionsToBeTarget});
        this.isActive = false;
        this.activeClass = activeClass;
        this.currentResource = maxResource;
        this.canBeMoved = canBeMoved;
        if(canBeMoved) {
            this.movingClass = movingClass;
            this.isMoving = false;
            this.leftMoveCorrection = leftMoveCorrection;
            this.topMoveCorrection = topMoveCorrection;
            this.target = '';
        }
        this.renewable = renewable;
        this.renewResourceOnEnd = renewResourceOnEnd;
        this.maxResource = maxResource;
    }

    addSoundSettings(sounds = {startMovingSound, actionSound, stopMovingSound}) {
        this.hasSound = true;
        for (let sound in Object.keys(sounds)){
            if( sound instanceof Sound) {
                this[key] = sound[key];
            }
        }
    }

    // addTo(container) {
    //     super.addTo(container);
    //     //this.addToggleActive();
    //     this.followMouse();
    // }


    togglePosition(e) {
        if (this.isMoving) {
            this.takeMousePosition(e);
        } else {
            this.takeInitialPosition();
        }   
    }

    takeInitialPosition(){
        this.block.style.position = '';
        this.block.style.left = '';
        this.block.style.top = '';
        this.block.style.right = '';
        this.block.style.bottom = '';
    }

    takeMousePosition(e) {
        this.place({
            params: {
                left: `${e.clientX - this.viewPortMouseCorrection.left + this.leftMoveCorrection}px`,
                top: `${e.clientY - this.viewPortMouseCorrection.top + this.topMoveCorrection}px`
            }
        })
    }

    followMouse(){
        this.container.addEventListener('mousemove', (e) => {
            if(this.isMoving) {
                this.takeMousePosition(e);
            }
        })
    }

    looseResource() {
        this.stopActivityOnNoResource();
        this.toggleActivityClass();
        if (this.isActive) {
            this.currentResource --;
        }
    }

    gainResource() {
        this.toggleActivityClass();
        if (this.currentResource < this.maxResource && !this.isActive && !this.isMoving) {
            this.currentResource ++;
        }
    }

    stopActivityOnNoResource(){
        if(this.currentResource === 0) {
            this.isActive = false;
        } 
    }

    toggleActivityClass() {
        if(this.isActive) {
            if (!this.block.classList.contains(this.activeClass)) {
                this.block.classList.add(this.activeClass)
            }
        } else {
            if (this.block.classList.contains(this.activeClass)) {
                this.block.classList.remove(this.activeClass)
            }
        }
    }

    fillWithResource({entityToFill, timeStep=200, responsibleOpacity=false, showCurrentResource=false, units=''}={}) {
        const timer = setInterval(()=> {
            if(this.isActive) {
                this.looseResource();
                showCurrentResource && this.setTextInPart({
                    name: 'resource-count', 
                    text: `${this.currentResource} ${units}`
                });
                responsibleOpacity && this.setOpacityOnResource();
                entityToFill.gainResource();
                entityToFill.setTextInPart({
                    name: 'resource-count', 
                    text: `${entityToFill.currentResource} ${units}`
                });
            } else {
                clearInterval(timer);
                if(this.renewResourceOnEnd) {
                    this.renewResourceAfterDelay();
                }
            }
        }, timeStep);
    }

    highLightIfHasTarget() {
        if (this.target && this.isMoving) {
            this.block.classList.add('highlight');
        } else {
            this.block.classList.remove('highlight');
        } 
    }

    setOpacityOnResource() {
        this.block.style.opacity = Math.min(1, this.currentResource / this.maxResource);
    }

    renewResourceAfterDelay({delay=4000, responsibleOpacity=true, showCurrentResource=false, step=200}={}) {
        setTimeout(() => {
            const timer = setInterval(()=> {
                if(!this.isActive && this.currentResource < this.maxResource) {
                    this.currentResource ++;
                    showCurrentResource && this.setTextInPart({
                        name: 'resource-count', 
                        text: this.currentResource
                    });
                    responsibleOpacity && this.setOpacityOnResource();
                } else {
                    clearInterval(timer)
                }
            }, step)
        }, delay)
    }
    


}