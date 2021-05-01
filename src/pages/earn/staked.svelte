<script lang="ts">
    import {derived} from 'svelte/store'

    import {currentAccount} from '~/store'

    export const staked = derived([currentAccount], ([$currentAccount]) => {
        let percentage = 100
        console.log($currentAccount)
        if ($currentAccount) {
            const max = Number($currentAccount?.cpu_limit.max)
            const usage = Number($currentAccount?.cpu_limit.used)
            percentage = (usage / max) * 100
            if (max === 0 || percentage > 100) {
                percentage = 100
            }
            return percentage.toFixed(1)
        }
    })
</script>

<h4>Staked Tokens</h4>
<p>
    {staked}
</p>
