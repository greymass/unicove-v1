<script>
	export let open = false
</script>

<button class="text-gray-500 hover:text-gray-700 cursor-pointer mr-4 border-none focus:outline-none" class:open on:click={() => open = !open}>
	<svg width=32 height=24>
		<line id="top" x1=0 y1=4 x2=22 y2=4/>
		<line id="bottom" x1=0 y1=18 x2=22 y2=18/>
	</svg>
</button>

<style>
	svg {
		min-height: 14px;
		transition: transform 0.3s ease-in-out;
	}

	svg line {
		stroke: var(--main-blue);
		stroke-width: 3;
		transition: transform 0.3s ease-in-out;
		border-radius: 5;
	}

	button {
		z-index: 20;
	}

	.open svg {
		transform: scale(0.8)
	}

	.open #top {
		transform: translate(9px, 3px) rotate(45deg)
	}

    .open #bottom {
		transform: translate(-6px, 9px) rotate(-45deg)
	}
</style>
