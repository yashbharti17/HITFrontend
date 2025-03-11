// Prevent back button navigation
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.pushState(null, null, location.href);
};
