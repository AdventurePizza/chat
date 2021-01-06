//@ts-ignore
import confetti from 'canvas-confetti';

function fire(particleRatio: number, opts: any) {
	let count = 200;
	let defaults = {
		origin: { y: 0.7 }
	};
	confetti(
		Object.assign({}, defaults, opts, {
			particleCount: Math.floor(count * particleRatio)
		})
	);
}

function randomInRange(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

//Celebration - Animation
export const activateRandomConfetti = () => {
	fire(0.25, {
		spread: 26,
		startVelocity: 55
	});
	fire(0.2, {
		spread: 60
	});
	fire(0.35, {
		spread: 100,
		decay: 0.91,
		scalar: 0.8
	});
	fire(0.1, {
		spread: 120,
		startVelocity: 25,
		decay: 0.92,
		scalar: 1.2
	});
	fire(0.1, {
		spread: 120,
		startVelocity: 45
	});
};

export const activateSchoolPride = () => {
	let end = Date.now() + 1.3 * 1000;
	// go Buckeyes!
	let colors = ['#bb0000', '#ffffff'];

	(function frame() {
		confetti({
			particleCount: 2,
			angle: 60,
			spread: 55,
			origin: { x: 0 },
			colors: colors
		});
		confetti({
			particleCount: 2,
			angle: 120,
			spread: 55,
			origin: { x: 1 },
			colors: colors
		});

		if (Date.now() < end) {
			requestAnimationFrame(frame);
		}
	})();
};

export const activateFireworks = () => {
	let duration = 2 * 1000;
	let animationEnd = Date.now() + duration;
	let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	let interval: NodeJS.Timeout = setInterval(function () {
		let timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		let particleCount = 50 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
			})
		);
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
			})
		);
	}, 250);
};

export const activateSnow = async () => {
	const duration = 3.5 * 1000;
	const animationEnd = Date.now() + duration;
	let skew = 1;

	(function frame() {
		let timeLeft = animationEnd - Date.now();
		let ticks = Math.max(200, 500 * (timeLeft / duration));
		skew = Math.max(0.8, skew - 0.001);

		confetti({
			particleCount: 1,
			startVelocity: 0,
			ticks: ticks,
			gravity: 0.5,
			origin: {
				x: Math.random(),
				// since particles fall down, skew start toward the top
				y: Math.random() * skew - 0.2
			},
			colors: ['#ffffff'],
			shapes: ['circle'],
			scalar: randomInRange(0.4, 1)
		});

		if (timeLeft > 0) {
			requestAnimationFrame(frame);
		}
	})();
};
