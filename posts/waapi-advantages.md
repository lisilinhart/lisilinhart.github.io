---
title: Advantages of the Web Animations Api
lang: en
keys: web animation api, javascript, css variables, a11y
date: 2017-10-06
---

# Advantages of the Web Animations API

### CSS vs. Javascript
While CSS Animation has gotten really powerful in the past few years, especially with the rise of CSS Variables, CSS will always be a _declarative_ language while Javascript is _imperative_.  So if you do an animation in CSS you have to specifically describe what is going to happen for every step, whereas in Javascript with the WAAPI you are more flexible, because you can programmatically define the animation in an animation object.

#### WAAPI Animation controls
The WAAPI let’s you reverse, pause, speed up your animations and gives you callbacks for when an animation has finished. These things are fairly hard to do in CSS , especially chaining multiple animations requires a lot of variables or specifying exactly when what it is going to happen. 

```javascript
const animation = element.animate(/* animation */);
animation.playbackRate = .5; // make it slower

animation.pause(); // playstate: "paused"
animation.play();  // playstate: "running"
animation.cancel(); // playstate: "idle"
animation.finish(); // playstate: "finished"
```


### Styling vs. Behaviour
The more interactive and complicated an animation gets in CSS, the more CSS tricks & hacks you are going to need, which might make your CSS harder to read for other people. So for example of you have a `div`, that you want to fade out when you click on it, there would be three forward ways to do it. 

#### Pure CSS
In order to do it in [pure CSS](https://codepen.io/lisilinhart/pen/RLxKrQ) you would need a checkbox to register the click. Once the checkbox is `:checked` you could play the according CSS animation. This does however require another element on top of our original element. 

```css
input[type="checkbox"]:checked + .element {
	animation: fadeOut 2s linear 0s 1 forwards;
}
```


### CSS Animation with class changes via JS
What gotten quite popular in the past years is to start animations by [toggling an animation class](https://codepen.io/lisilinhart/pen/KXqqyX) via Javascript. For this option you already need some Javascript to handle your events. Your animations however are still defined declaratively in CSS. 

```javascript
element.addEventListener('click', (e) => {
	element.classList.toggle('animated');
});
```

```css
.element.animated {
    animation: fadeOut 2s linear 0s 1 forwards;
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
```

### Animate in Javascript with the WAAPI
With the Web Animations API you got a third option, in which you [define all of your animations in your Javascript](https://codepen.io/lisilinhart/pen/EwXvWx). This option allows you to take the animation behaviour out of your CSS and use CSS purely for styling, while still taking advantage of CSS hardware acceleration and rendering animations over the GPU. 

```javascript 
element.addEventListener('click', (e) => {
  element.animate([
    { opacity: 1 },
    { opacity: 0 },
  ], {
    duration: 2000, 
    easing: 'ease', 
    iterations: 1, 
    direction: 'normal', 
    fill: 'forwards' 
  });															
});
```

Nevertheless this doesn’t mean you have to abandon CSS animations. You still have the option to combine the two, when it makes more sense to do an animation in CSS, because of the simplicity.

### Hardware Acceleration
In the past you would often prefer CSS Animation, because it gave you hardware acceleration and it could render properties like `opacity` or `transform` very performant over the GPU. But now you will also get this acceleration in the WAAPI, if the browsers already supports the Web Animation API.

### Tell the Browser what is animated
When you use the Web Animations API, all your animations will be described in the `document.timeline` and you (and the browser) have access to all the animations. 

What’s a problem with external animation libraries is that the Browser sometimes doesn’t recognise elements that the library animates as elements that are animated and therefore they aren’t promoted to their own layer or rendered over the GPU. With the WAAPI we’re telling the Browser: “Hey Browser, I’m animating this element with the API you’re providing, can you please optimise it for me with what’s available to you?” 

### It’s native
The browser are already working hard on implementing the API and Firefox  has large parts of it implemented already. This means you maybe won’t need to add an large external library to do some chained custom animations in the future. 

Of course there will always be a need for libraries like Greensock, because they are aimed to do a lot more than the API  (SVG morphing for example) and are easily understandable for developers and designers, but with the API you have a simple native option to do more advanced animations without needing to add or learn a new library. 

Since it’s not fully supported yet, there is a great [polyfill](https://github.com/web-animations/web-animations-js) you can use and it [supports all the major browsers](https://github.com/web-animations/web-animations-js/blob/dev/docs/support.md#browser-support) already, falling back to the native implementation if there is one.

### Animations in the document
If you have all animations described in your `document.timeline`, you have easy access to all the animations that are happening on your site. 

### Responsibility
It’s a big problem that animations can be mentally taxing for people if they’re overdone or if they suffer from an illness like vestibular disorder (more in [this article](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity)) .  So providing an option to disable the animations is important. Since they are all in the document you can call `getAnimations()` on the `document` and `cancel()` them if needed. 

```javascript
const animation = element.animate(/* animation */);

if (window.matchMedia('(prefers-reduced-motion)')) {
	document.getAnimations().forEach( // get all animations
  		(animation) => animation.cancel(); // cancel them
	); 
}
```

#### CSS can do this too
There is also a great way to take care of this in CSS with CSS Custom Properties: 

```css
:root {
	--duration: 0.8;

	@media (prefers-reduced-motion: reduce) {
		--duration: 0;
	}
}

.element {
	animation: fadeOut calc(var(--duration) * 1s) linear;
}
```

### Interaction
The WAAPI works hand in hand with Javascript DOM Events and creating more interactive, reactive animations. 

Last week I created a [pen animating tiles](https://codepen.io/lisilinhart/pen/rGwbwg) to reveal underlying text. It creates `Tile` function class, that creates an animation for each element in the grid `gridItems.forEach((item) => new Tile(item));` .

Once the animation for this tile is created `this.opacity = this.element.animate(..)`, it is immediately paused with `this.opacity.pause();` and only played once the `mouseover` event is fired.  

When we click the `Reset Tiles` button, I change the `playbackRate` of all the animations to `-1` , which plays all the animations in reverse and animates them back in. I could have also called `this.opacity.reverse()` , which would have done the same thing.

This interaction was quite simple to create with the WAAPI, but would have required a lot of class changes on the DOM if I’d done it with CSS Animation. In this case working with the animation object  turned out to be really useful and straight forward. 

### Conclusion
The Web Animations API definitely has an important place in the world of web animation, because it builds the basis for describing native animations across all browsers. It gives us a lot of new options like playback control, CSS hardware acceleration in JS and access to all animations in our document. It also let’s you put more complicated animation behaviour (e.g. chained timelines) in your Javascript, which in return can make your CSS simpler. 

In conclusion there is many ways to animate on the web and the WAAPI is not the solution to all the animation challenges. There are really amazing pure CSS solutions for common problems and I recommend everyone to try to do animations in pure CSS, just because it can be really rewarding to dive deeper into CSS, because you really don’t always need Javascript. CSS is really powerful by itself. Just have a look at [David Khourshid](https://codepen.io/davidkpiano/pen/ByNPQw), [Una Kravets](https://codepen.io/una/pen/Wjvdqm) or [Shaws](https://codepen.io/shshaw/pen/pWwrmM) Codepens.

However when animations get more complicated and you want to have more control over your native animations, the WAAPI is going to be your friend. Javascript will give you a lot of flexibility, when you want to create dynamic values or handle DOM Events to make something more interactive. 

### Resources

* [Dan Wilson - When to Use the Web Animations API](http://danielcwilson.com/blog/2016/08/why-waapi/)
* [James Lee - Animation: CSS vs. Javascript](https://www.seguetech.com/animation-css-vs-javascript/)
* [Designing Safer Web Animation For Motion Sensitivity](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity)
* [Non Breaking Space Show - Rachel Nabors](https://goodstuff.fm/nbsp/131)