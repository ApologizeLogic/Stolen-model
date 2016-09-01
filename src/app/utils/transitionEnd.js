function whichTransitionEvent(){
    let t;
    let el = document.createElement('fakeelement');
    let transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd',
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
};

const transEndEventName = whichTransitionEvent();
const onEndTransition = function( el, callback ) {
  let onEndCallbackFn = function( ev ) {
    if( ev.target !== this ) return;
    this.removeEventListener( transEndEventName, onEndCallbackFn );
    if( callback && typeof callback === 'function' ) { callback.call(this); }
  };
  el.addEventListener( transEndEventName, onEndCallbackFn );
};

export default onEndTransition;