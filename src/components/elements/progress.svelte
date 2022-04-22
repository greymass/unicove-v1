<script lang="ts">
    export let percent: string | number = '0'
</script>

<style type="scss">
    .progress-bar {
        display: flex;
        background-color: var(--cultured);
        border-radius: 12px;
        margin: 0;
        padding: 0;
        .indicator {
            background-color: var(--lapis-lazuli);
            border-radius: 12px;
            margin: 0;
            min-height: 10px;
            padding: 0;
            width: var(--percent);
            :global(.darkmode) & {
                background-color: var(--middle-green-eagle);
            }
        }
    }
</style>

<div class="progress-bar">
    <div class="indicator" style="--percent:{percent}%" />
</div>
