import Block from "../baseClasses/block.js";

function setCustomScroll({wrapper, scroll, runner}) {

    scroll.style.display = 'flex';

    const wrapperHeight = wrapper.getBoundingClientRect().height;
    const scrollHeight = scroll.getBoundingClientRect().height;
    const runnerHeight = runner.getBoundingClientRect().height;
    const runnerShadowHeight = scrollHeight - runnerHeight;

    runner.style.boxShadow = `
    inset 0px -1px 0px 1px #5868ad, 
    inset 0px 0px 1px 1px #fff,
    0 -50px 50px 50px #4eebfc,
    0 -${runnerShadowHeight}px 0px ${runnerShadowHeight - runnerHeight/2}px #5868ad`;

    let runnerPressed = false;

    runner.addEventListener('mousedown', (e) => {
        runnerPressed = true;
    });

    window.addEventListener('mouseup', (e) => {
        if(runnerPressed) {
            runnerPressed = false;
        }
    });

    wrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    if(e.clientX > wrapper.getBoundingClientRect().left &&
        e.clientX < wrapper.getBoundingClientRect().right &&
        e.clientY >= wrapper.getBoundingClientRect().top &&
        e.clientY <= wrapper.getBoundingClientRect().bottom 
        ) {

            const top = Math.floor(wrapper.scrollTop);
            const stepVertical = 0.5 * e.deltaY;
            const maxScrolled = wrapper.scrollHeight - wrapper.offsetHeight;
            const scrollPosition = Math.floor(Math.min(Math.max(0, top + stepVertical), maxScrolled));
            wrapper.scrollTo(0, scrollPosition);
            const percentScrolled = Math.round(100 * wrapper.scrollTop / maxScrolled)/100;
            runner.style.top = (scrollHeight - runnerHeight) * percentScrolled + 'px';

        }
    });

    window.addEventListener('mousemove', (e) => {
        const clientRelativeScrollTop = Math.floor(scroll.getBoundingClientRect().top);
        const clientRelativeScrollBottom = Math.floor(scroll.getBoundingClientRect().bottom);

    if (e.clientX > scroll.getBoundingClientRect().left &&
        e.clientX < scroll.getBoundingClientRect().right &&
        e.clientY >= clientRelativeScrollTop + runnerHeight/2 &&
        e.clientY <= clientRelativeScrollBottom - runnerHeight/2 &&
        runnerPressed
        ) {
            runner.style.top = e.clientY - clientRelativeScrollTop - runnerHeight/2  + 'px';
            const percentScrolled = (Math.floor(e.clientY - clientRelativeScrollTop - runnerHeight/2) / (scrollHeight-runnerHeight));
            wrapper.scrollTo(0,percentScrolled * (wrapper.scrollHeight - wrapperHeight));
        }
    });
}

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
                name: 'aside',
                classes: ['informator_aside']
            }
        ]
    });

    const info = new Block({
        name: 'info', 
        wrapper: {classes: ['informator_info']}
    });

    const optional = new Block({
        name: 'optional', 
        wrapper: {classes: ['informator_optional']}
    });
    
    const wrapper = new Block({
        name: 'wrapper', 
        wrapper: {classes: ['informator_wrapper']},
        innerElems: [
            {
                name: 'content',
                classes: ['informator_content'] 
            }
        ]
    });

    const scroll = new Block({
        name: 'scroll', 
        wrapper: {classes: ['informator_scroll']},
        innerElems: [
            {
                name: 'runner',
                classes: ['informator_runner'] 
            }
        ]
    });


    informator.getPart('aside').append(info.block, optional.block);
    info.block.append(wrapper.block, scroll.block);

    

    async function addBtnIfNeeded(){
        return new Promise((resolve, reject) => {
            if (Object.keys(btnSettings).length) {
                setTimeout(()=> {
                    const btn = document.createElement('btn');
                    btn.innerText = btnSettings.text ? btnSettings.text : 'Click!';
                    btnSettings.className && btn.classList.add(btnSettings.className);
                    optional.block.append(btn);

                    if (wrapper.block.scrollHeight > wrapper.block.offsetHeight) {
                        setCustomScroll({
                            wrapper: wrapper.block,
                            scroll: scroll.block,
                            runner: scroll.getPart('runner')
                        })
                    }

                    btn.addEventListener('click', ()=> {
                        btnSettings.sound && btnSettings.sound.playWatchingSoundAllowed();
                        resolve();
                    }, {once: true});
                }, btnSettings.delay);
            } else {
                if (wrapper.block.scrollHeight > wrapper.block.offsetHeight) {
                    setCustomScroll({
                        wrapper: wrapper.block,
                        scroll: scroll.block,
                        runner: scroll.getPart('runner')
                    })
                }
                resolve();
            }
        })
        
    }
    
    
    await informator.place({ params: {left: '20px', bottom: '20px'}, delay: 1000 });
    wrapper.setTextParagraphs({name: 'content', textArray: text });
    informator.addTo(container);

    
   
    await informator.graduallyAppear(1000, informator.block);

    await addBtnIfNeeded();

    return {
        informator: informator,  
        info: info,
        optional: optional,
        wrapper: wrapper,
        scroll: scroll
    };
}
