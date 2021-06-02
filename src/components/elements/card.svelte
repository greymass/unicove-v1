<style type="scss">
    .card {
        border: 1px solid var(--divider-grey);
        border-radius: 10px;
        padding: 40px 52px;
        @media (max-width: 600px) {
            padding: 0;
            border: 0;
            margin: 0 16px;
        }
    }
</style>

<section class="card"><slot /></section>
