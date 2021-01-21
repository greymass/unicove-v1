<script>
    export let open = false
</script>

<style>
    button {
        position: absolute;
        top: 24px;
        left: 24px;
        color: gray;
        cursor: pointer;
        border: none;
        background-color: transparent;
        z-index: 2000;
    }

    button:focus {
        outline: none;
    }

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

    .open svg {
        transform: scale(0.8);
    }

    .open #top {
        transform: translate(9px, 3px) rotate(45deg);
    }

    .open #bottom {
        transform: translate(-6px, 9px) rotate(-45deg);
    }
</style>

<button class:open on:click={() => (open = !open)}>
    <svg width="32" height="24">
        <line id="top" x1="0" y1="4" x2="22" y2="4" />
        <line id="bottom" x1="0" y1="18" x2="22" y2="18" />
    </svg>
</button>
