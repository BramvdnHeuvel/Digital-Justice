function resetFrameSize() {
    let expandableIFrames = document.getElementsByClassName('expanding-iframe');

    for(let i = 0; i < expandableIFrames.length; i++) {
        let frame = expandableIFrames[i];
        let parent = frame.parentNode;

        frame.width = 0;
        frame.height = 0;
    }

    for(let i = 0; i < expandableIFrames.length; i++) {
        let frame = expandableIFrames[i];
        let parent = frame.parentNode;

        let startWidth = Number(frame.getAttribute('swidth'));
        let startHeight = Number(frame.getAttribute('sheight'));

        frame.width = Math.min(parent.offsetWidth, 800);
        frame.height = frame.width * startHeight / startWidth
    }
}

window.addEventListener('resize', resetFrameSize);
resetFrameSize();