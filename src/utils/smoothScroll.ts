import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function smoothScroll(content: any, viewport = undefined, smoothness: number = 1) {
	const contentElement = gsap.utils.toArray(content)[0] as HTMLElement;

	gsap.set(viewport || contentElement.parentNode, {
		overflow: "hidden",
		position: "fixed",
		height: "100%",
		width: "100%",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	});

	gsap.set(contentElement, { overflow: "visible", width: "100%" });

	let getProp = gsap.getProperty(contentElement),
		setProp = gsap.quickSetter(contentElement, "y", "px"),
		setScroll = ScrollTrigger.getScrollFunc(window),
		removeScroll = () => (contentElement.style.overflow = "visible"),
		killScrub = (trigger: any) => {
			let scrub = trigger.getTween ? trigger.getTween() : gsap.getTweensOf(trigger.animation)[0]; // getTween() was added in 3.6.2
			scrub && scrub.pause();
			trigger.animation.progress(trigger.progress);
		},
		height: number,
		isProxyScrolling: boolean;

	function refreshHeight(): number {
		height = contentElement.clientHeight;
		contentElement.style.overflow = "visible";
		document.body.style.height = height + "px";
		return height - document.documentElement.clientHeight;
	}

	ScrollTrigger.addEventListener("refresh", () => {
		removeScroll();
		requestAnimationFrame(removeScroll);
	});

	ScrollTrigger.defaults({ scroller: contentElement });
	ScrollTrigger.prototype.update = (p: any) => p; // works around an issue in ScrollTrigger 3.6.1 and earlier (fixed in 3.6.2, so this line could be deleted if you're using 3.6.2 or later)

	ScrollTrigger.scrollerProxy(contentElement, {
		// @ts-ignore
		scrollTop(value: number) {
			if (arguments.length) {
				isProxyScrolling = true;
				setProp(-value);
				setScroll(value);
				return;
			}
			return -getProp("y");
		},
		scrollHeight: () => document.body.scrollHeight,
		getBoundingClientRect() {
			return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
		},
	});

	return ScrollTrigger.create({
		animation: gsap.fromTo(
			contentElement,
			{ y: 0 },
			{
				y: () => document.documentElement.clientHeight - height,
				ease: "none",
				onUpdate: ScrollTrigger.update,
			}
		),
		scroller: window,
		invalidateOnRefresh: true,
		start: 0,
		end: refreshHeight,
		refreshPriority: -999,
		scrub: smoothness,
		onUpdate: (self: ScrollTrigger) => {
			if (isProxyScrolling) {
				killScrub(self);
				isProxyScrolling = false;
			}
		},
		onRefresh: killScrub, // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
	});
}

export default smoothScroll;
