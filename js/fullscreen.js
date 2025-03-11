function toggle_full_screen() {
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Safari
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE11
        document.documentElement.msRequestFullscreen();
      }
    }
  }
  window.history.forward();
function loadHtml(pageIndex){
  $("#questionDate").load(`./Questions/${pageIndex}.html`);
}
