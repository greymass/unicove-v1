<script lang="ts">
    export let percent: string | number = '0'
</script>

<style type="scss">
    .progress-bar {
        border: 1px solid black;
        display: flex;
        margin: 0;
        padding: 0;
        .indicator {
            background-color: red;
            margin: 0;
            min-height: 10px;
            padding: 0;
            width: var(--percent);
        }
    }
</style>

<div class="progress-bar">
    <div class="indicator" style="--percent:{percent}%" />
</div>
