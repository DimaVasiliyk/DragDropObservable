	import { fromEvent ,last} from 'rxjs'
	import { switchMap, takeUntil, map, tap } from 'rxjs/operators';
	import { combineLatest } from 'rxjs'



	let mouseMove$ = fromEvent(document, 'mousemove');

	let mouseUp$ = fromEvent(document, 'mouseup');

	let elements = document.querySelectorAll('.box');
	console.log(elements);

	Array.from(elements).forEach(createDraggableElement);

	function createDraggableElement(elem) {
		const mouseDown$ = fromEvent(elem, 'mousedown');

		const dragStart$ = mouseDown$;
		const dragMove$ = dragStart$.pipe(
			switchMap((start) =>
				mouseMove$.pipe(
					map((moveEvent) => ({
						originalEvent: moveEvent,
						deltaX: moveEvent.pageX - start.pageX,
						deltaY: moveEvent.pageY - start.pageY,
						startOffsetX: start.offsetX,
						startOffsetY: start.offsetY
					})),
					takeUntil(mouseUp$)
				)
			)
		);

		const dragEnd$ = dragStart$.pipe(
			switchMap(start =>
			  mouseMove$.pipe(
				map(moveEvent => ({
				  originalEvent: moveEvent,
				  deltaX: moveEvent.pageX - start.pageX,
				  deltaY: moveEvent.pageY - start.pageY,
				  startOffsetX: start.offsetX,
				  startOffsetY: start.offsetY
				})),
				takeUntil(mouseUp$),
				last(),
			  )
			)
		  );

		dragMove$.subscribe((move) => {
			const offsetX = move.originalEvent.x - move.startOffsetX;
			const offsetY = move.originalEvent.y - move.startOffsetY;
			elem.style.left = offsetX + 'px';
			elem.style.top = offsetY + 'px';
		})

		combineLatest([
			dragStart$.pipe(
			  tap(event => {
				elem.classList.add("move")
			  })
			),
			dragMove$.pipe(
			  tap(event => {
				colisionHandler(elem)
			  })
			),
			dragEnd$.pipe(
			  tap(event => {
				elem.classList.remove("collisied")
				elem.classList.remove("move")
			})
			)
		  ]).subscribe();

}


function colisionHandler(dragableElement, attemp = 3){

	if(attemp < 0) return null;

	// elements.forEach(element => {
	// 	if(element.classList.contains('move')) {
	// 		console.log('tut')
	// 		return;
	// 	};
	
	// 	const isIntersect = isCollide( element.getBoundingClientRect(),dragableElement.getBoundingClientRect());

	// 	if(isIntersect){
	// 		console.log(dragableElement);
	// 		return dragableElement.classList.add("collisied"),element.classList.add("collisied")
	// 	} else {
	// 		dragableElement.classList.remove("collisied"),element.classList.remove("collisied")
	// 	}
	// })

	for(let element of elements ){
		if(element.classList.contains('move')) {
			continue;
				};
			
				const isIntersect = isCollide( element.getBoundingClientRect(),dragableElement.getBoundingClientRect());
		
				if(isIntersect){
					console.log(dragableElement);
					 dragableElement.classList.add("collisied"),element.classList.add("collisied")
					break;
				} else {
					dragableElement.classList.remove("collisied"),element.classList.remove("collisied")
				}
	}



}







	function isCollide(aRect, bRect) {
		return !(
			((aRect.top + aRect.height) < (bRect.top)) ||
			(aRect.top > (bRect.top + bRect.height)) ||
			((aRect.left + aRect.width) < bRect.left) ||
			(aRect.left > (bRect.left + bRect.width))
	);
}

