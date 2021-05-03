<script>
    import Segment from '~/components/elements/segment.svelte'
    import SegmentGroup from '~/components/elements/segment/group.svelte'
</script>

<style lang="scss">
    h2 {
        margin: 20px 0;
    }
</style>

<h2>Segment</h2>

<Segment>
    <p>Some test content within a segment.</p>
</Segment>

<h2>Segment Group</h2>

<p>Two Elements</p>

<SegmentGroup>
    <Segment>Left</Segment>
    <Segment>Right</Segment>
</SegmentGroup>

<p>Three Elements</p>

<SegmentGroup>
    <Segment>One</Segment>
    <Segment>Two</Segment>
    <Segment>Three</Segment>
</SegmentGroup>

<p>Eight Elements</p>

<SegmentGroup>
    <Segment>One</Segment>
    <Segment>Two</Segment>
    <Segment>Three</Segment>
    <Segment>Four</Segment>
    <Segment>Five</Segment>
    <Segment>Six</Segment>
    <Segment>Seven</Segment>
    <Segment>Eight</Segment>
</SegmentGroup>

<h2>Vertical Segment Group</h2>

<p>Two Elements</p>

<SegmentGroup vertical>
    <Segment>Top</Segment>
    <Segment>Bottom</Segment>
</SegmentGroup>

<p>Three Elements</p>

<SegmentGroup vertical>
    <Segment>One</Segment>
    <Segment>Two</Segment>
    <Segment>Three</Segment>
</SegmentGroup>
