import Block from "./block.js";

export default class ElemChangingOnGainResource extends Block{
    constructor({name, wrapper, innerElems, correctionsToBeTarget, stages}) {
        super({name, wrapper, innerElems, correctionsToBeTarget});
        this.currentResource = 0;
        this.stages = stages;
        this.resourceToFinish = stages[stages.length - 1][1];
        this.finish = false;
    }

    getChangedOnResource({stageSound, harvestSound}={}) {
        const matchedStage = this.stages.find(stage => this.currentResource === stage[1]);
        if (matchedStage) {
            this.block.setAttribute('data-stage', matchedStage[0]);
            if(this.stages.indexOf(matchedStage) === this.stages.length - 1) {
                harvestSound && harvestSound.playWatchingSoundAllowed();
                this.finish = true;
            } else {
                stageSound && stageSound.playWatchingSoundAllowed();
            }
        }
    }

    gainResource() {
        if(this.currentResource < this.resourceToFinish) {
            this.currentResource ++;
        }    
    }
}