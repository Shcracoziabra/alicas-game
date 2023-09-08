import Block from "../baseClasses/block.js";

export default async function setInformator({
    container, 
    text=[], 
    btnSettings={}}) {

    const informator = new Block({
        name: 'informator', 
        wrapper: {classes: ['informator']},
        innerElems: [
            {
                name: 'avatar',
                classes: ['informator_avatar'] 
            },
            {
                name: 'container',
                classes: ['informator_container']
            }
        ]
    });
    
    const message = new Block({
        name: 'text', 
        wrapper: {classes: ['informator_text']}
    });

    async function addBtnIfNeeded(){
        return new Promise((resolve, reject) => {
            if (Object.keys(btnSettings).length) {
                setTimeout(()=> {
                    const btn = document.createElement('btn');
                    btn.innerText = btnSettings.text ? btnSettings.text : 'Click!';
                    btnSettings.className && btn.classList.add(btnSettings.className);
                    btn.addEventListener('click', ()=> {
                        btnSettings.sound && btnSettings.sound.playWatchingSoundAllowed();
                        resolve();
                    }, {once: true});
                    informator.getPart('container').append(btn);
                }, btnSettings.delay);
            } else {
                resolve();
            }
        })
        
    }
    
    
    await informator.place({params: {left: '20px', bottom: '20px'}, delay: 1000});
    informator.addTo(container);
    message.setTextParagraphes(text);
    message.addTo(informator.getPart('container'));
    await message.graduallyAppear(1000, message.block);
    await addBtnIfNeeded();
    return {informator: informator, message: message};
}
