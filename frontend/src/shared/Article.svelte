<script>
  import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from "@smui/card";
  export let title;
  export let description;
  export let imageURL;
  export let index = 0;
</script>

<div class="row">
  {#if index % 2 == 0}
    <div class="col s12 m6">
      <h2>{title}</h2>
      <span>
        {description}
      </span>
    </div>
  {/if}
  <div class="col s12 m6">
    <div class="card-container">
      <Card>
        <Content>
          <slot />
          <img
            src={imageURL}
            alt={title}
            class="materialboxed"
            style="width:100%"
          />
        </Content>
      </Card>
    </div>
  </div>
  {#if index % 2 == 1}
    <div class="col s12 m6">
      <h2>{title}</h2>
      <span>
        {description}
      </span>
    </div>
  {/if}
</div>
