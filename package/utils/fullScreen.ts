const doc = document as any

//进入全屏
export const enterFullscreen = (el: any = {}) => {
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    }
}

//退出全屏
export const exitFullscreen = () => {
    if (doc.exitFullScreen) {
        doc.exitFullScreen();
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
    }
}

//判断是否全屏
export const isFullscreen = () => {
    return !!(
        doc.fullscreen ||
        doc.mozFullScreen ||
        doc.webkitIsFullScreen ||
        doc.webkitFullScreen ||
        doc.msFullScreen
    );
}

//文档是否能切换到全屏
export const isFullscreenEnabled = () => {
    return (
        doc.fullscreenEnabled ||
        doc.mozFullScreenEnabled ||
        doc.webkitFullscreenEnabled ||
        doc.msFullscreenEnabled
    );
}

//获取当前全屏节点
export const getFullscreenElement = () => {
    return (
        doc.fullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullScreenElement ||
        doc.webkitFullscreenElement || null
    );
}
